
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types";

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  needsPasswordChange: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

class AuthManagerClass {
  private static instance: AuthManagerClass;
  private roleCache = new Map<string, { role: UserRole | null; timestamp: number }>();
  private pendingRoleRequests = new Map<string, Promise<UserRole | null>>();
  
  private constructor() {}
  
  static getInstance(): AuthManagerClass {
    if (!AuthManagerClass.instance) {
      AuthManagerClass.instance = new AuthManagerClass();
    }
    return AuthManagerClass.instance;
  }

  // Aguardar um tempo antes de fazer requests para evitar spam
  private async waitBeforeRequest(delay: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  // Limpar dados de autenticação do storage
  private clearAuthStorage(): void {
    try {
      // Remove dados do sessionStorage
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('redirectPath');
      sessionStorage.removeItem('deviceId');
      
      // Remove dados do localStorage
      localStorage.removeItem('userRole');
      
      // Remove todas as chaves relacionadas ao Supabase
      const keysToRemove: string[] = [];
      
      // localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          keysToRemove.push(key);
        }
      });
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // sessionStorage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Limpar cache
      this.roleCache.clear();
      this.pendingRoleRequests.clear();
      
      console.log("Auth storage cleared successfully");
    } catch (error) {
      console.error("Error clearing auth storage:", error);
    }
  }

  // Gerar ID único do dispositivo
  private getDeviceId(): string {
    let deviceId = sessionStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = `device_${Math.random().toString(36).substring(2, 15)}`;
      sessionStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  }

  // Rastrear sessão do usuário
  private async trackUserSession(userId: string): Promise<void> {
    try {
      const deviceId = this.getDeviceId();
      await supabase.from('user_sessions').upsert({
        user_id: userId,
        device_id: deviceId,
        last_active: new Date().toISOString(),
        metadata: {
          user_agent: navigator.userAgent,
        }
      }, { onConflict: 'user_id, device_id' });
    } catch (error) {
      console.error("Error tracking session:", error);
    }
  }

  // Buscar role do usuário com cache e debounce
  async fetchUserRole(userId: string): Promise<UserRole | null> {
    // Verificar cache primeiro (válido por 1 minuto)
    const cached = this.roleCache.get(userId);
    if (cached && Date.now() - cached.timestamp < 60000) {
      console.log("Using cached role:", cached.role);
      return cached.role;
    }

    // Se já existe uma requisição pendente, aguardar ela
    if (this.pendingRoleRequests.has(userId)) {
      console.log("Waiting for pending role request...");
      return this.pendingRoleRequests.get(userId)!;
    }

    // Criar nova requisição
    const rolePromise = this.performRoleFetch(userId);
    this.pendingRoleRequests.set(userId, rolePromise);

    try {
      const role = await rolePromise;
      
      // Cache o resultado
      this.roleCache.set(userId, {
        role,
        timestamp: Date.now()
      });
      
      console.log("Fetched and cached role:", role);
      return role;
    } finally {
      // Remover da lista de pendentes
      this.pendingRoleRequests.delete(userId);
    }
  }

  private async performRoleFetch(userId: string): Promise<UserRole | null> {
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        // Aguardar antes de fazer a requisição
        if (attempts > 0) {
          await this.waitBeforeRequest(500 + (attempts * 300)); // Aumentar delay a cada tentativa
        }
        
        console.log(`Fetching role for user ${userId}, attempt ${attempts + 1}`);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error(`Error fetching user role (attempt ${attempts + 1}):`, error);
          attempts++;
          continue;
        }
        
        const role = data?.role as UserRole || null;
        console.log(`Successfully fetched role: ${role}`);
        return role;
        
      } catch (error) {
        console.error(`Exception fetching user role (attempt ${attempts + 1}):`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          console.error("Max attempts reached, returning null");
          return null;
        }
      }
    }
    
    return null;
  }

  // Verificar se precisa trocar senha
  async needsPasswordChange(userId: string): Promise<boolean> {
    try {
      await this.waitBeforeRequest(200); // Pequeno delay
      
      const { data, error } = await supabase.rpc('user_needs_password_change', {
        user_uuid: userId
      });
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking password change:", error);
      return false;
    }
  }

  // Obter sessão atual
  async getCurrentSession(): Promise<{
    session: Session | null;
    user: User | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        return { session: null, user: null, error };
      }
      
      // Atualizar last_active sem aguardar
      if (data.session?.user) {
        this.trackUserSession(data.session.user.id).catch(console.error);
      }
      
      return {
        session: data.session,
        user: data.session?.user ?? null,
        error: null
      };
    } catch (error) {
      console.error("Error during session check:", error);
      return {
        session: null,
        user: null,
        error: error instanceof Error ? error : new Error("Unknown error")
      };
    }
  }

  // Login
  async login(credentials: LoginCredentials): Promise<{
    data: { user: User; session: Session } | null;
    error: Error | null;
  }> {
    try {
      // Limpar estado existente
      this.clearAuthStorage();
      
      // Tentar fazer logout global primeiro
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Could not perform global sign out before login:", err);
      }
      
      // Aguardar antes do login
      await this.waitBeforeRequest(300);
      
      // Fazer login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error("Login error:", error);
        let errorMessage = "Ocorreu um erro durante a autenticação";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Database error")) {
          errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
        }
        
        return { data: null, error: new Error(errorMessage) };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("Error during login:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Erro desconhecido durante o login")
      };
    }
  }

  // Registro
  async signUp(signUpData: SignUpData): Promise<{
    data: { user: User } | null;
    error: Error | null;
  }> {
    try {
      this.clearAuthStorage();
      
      // Aguardar antes do registro
      await this.waitBeforeRequest(300);
      
      const { data, error } = await supabase.auth.signUp({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          data: signUpData.metadata,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        let errorMessage = "Ocorreu um erro durante o cadastro";
        
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        }
        
        return { data: null, error: new Error(errorMessage) };
      }
      
      return { data: { user: data.user! }, error: null };
    } catch (error) {
      console.error("Error during registration:", error);
      return {
        data: null,
        error: error instanceof Error ? error : new Error("Erro desconhecido durante o registro")
      };
    }
  }

  // Logout
  async logout(): Promise<{ error: Error | null }> {
    try {
      this.clearAuthStorage();
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Error during sign out:", error);
        return { error };
      }
      
      // Redirecionar para home
      window.location.href = '/';
      
      return { error: null };
    } catch (error) {
      console.error("Error during sign out:", error);
      return {
        error: error instanceof Error ? error : new Error("Erro desconhecido durante o logout")
      };
    }
  }

  // Trocar senha e ativar usuário
  async changePasswordAndActivate(newPassword: string): Promise<boolean> {
    try {
      // Atualizar senha
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (passwordError) throw passwordError;
      
      // Obter usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      
      // Marcar como ativo
      const { error: updateError } = await supabase.rpc('update_user_after_password_change', {
        user_uuid: user.id
      });
      
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error changing password and activating user:", error);
      return false;
    }
  }

  // Refresh automático do token
  async refreshToken(): Promise<{
    session: Session | null;
    error: Error | null;
  }> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error("Error refreshing token:", error);
        return { session: null, error };
      }
      
      return { session: data.session, error: null };
    } catch (error) {
      console.error("Error during token refresh:", error);
      return {
        session: null,
        error: error instanceof Error ? error : new Error("Erro durante refresh do token")
      };
    }
  }
}

export const AuthManager = AuthManagerClass.getInstance();
