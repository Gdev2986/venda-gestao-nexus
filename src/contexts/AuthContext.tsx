
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";

// Function to clean up Supabase-related data
export const cleanupSupabaseState = () => {
  try {
    // Clear standard auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Clear all Supabase keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if being used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth state cleanup complete");
  } catch (error) {
    console.error("Error during auth state cleanup:", error);
  }
};

// Create the auth context
export const AuthContext = createContext<any>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  console.log("AuthProvider rendering - isLoading:", isLoading, "user:", user?.email, "userRole:", userRole);

  // Function to fetch user role
  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching user role for:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      } 
      
      const normalizedRole = profile?.role?.toUpperCase() as UserRole;
      console.log("User role fetched:", normalizedRole);
      
      if (normalizedRole) {
        sessionStorage.setItem('userRole', normalizedRole);
      }
      
      return normalizedRole;
    } catch (err) {
      console.error("Error in role fetching:", err);
      return null;
    }
  };

  // Simple Session initialization
  useEffect(() => {
    console.log("Setting up auth listener and checking session");
    
    // Initial session check (synchronous first action)
    const initialSessionCheck = async () => {
      setIsLoading(true);
      
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession();
        
        // Update session state immediately
        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session);
        
        // If we have a user, check for cached role first
        if (session?.user) {
          const cachedRole = sessionStorage.getItem('userRole') as UserRole | null;
          if (cachedRole) {
            setUserRole(cachedRole as UserRole);
          }
          
          // Then fetch fresh role
          const role = await fetchUserRole(session.user.id);
          if (role) {
            setUserRole(role);
          }
        }
      } catch (error) {
        console.error("Error during initial session check:", error);
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event, "Session:", !!newSession);
        
        // Update session state synchronously
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setIsAuthenticated(!!newSession);

        // Handle auth events
        if (event === "SIGNED_IN" && newSession?.user) {
          console.log("Signed in event detected");
          
          // Check for cached role first
          const cachedRole = sessionStorage.getItem('userRole') as UserRole | null;
          if (cachedRole) {
            setUserRole(cachedRole as UserRole);
          }
          
          // Then fetch fresh role (without causing re-renders in a loop)
          fetchUserRole(newSession.user.id).then(role => {
            if (role) {
              setUserRole(role);
              
              toast({
                title: "Login bem-sucedido",
                description: "Bem-vindo ao SigmaPay!",
              });
            }
          });
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          
          // Clear auth data
          setSession(null);
          setUser(null);
          setUserRole(null);
          setIsAuthenticated(false);
          
          // Clean up auth data
          cleanupSupabaseState();
          
          toast({
            title: "Sessão encerrada",
            description: "Você foi desconectado com sucesso.",
          });
        }
      }
    );

    // Perform initial session check
    initialSessionCheck();

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth data
      cleanupSupabaseState();
      
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      
      // Sign out first to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return { user: null, error };
      }
      
      // Auth state change will handle session update
      setIsLoading(false);
      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsLoading(false);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error("Unknown error during login") 
      };
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string, role?: UserRole | string }) => {
    try {
      // Clean up existing auth data
      cleanupSupabaseState();
      
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      
      // Sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      // Sign up
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        let errorMessage = "Ocorreu um erro durante o cadastro";
        
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        }
        
        toast({
          title: "Erro de registro",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return { user: null, error };
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      setIsLoading(false);
      return { user: data?.user || null, error: null };
    } catch (error: any) {
      console.error("Error during registration:", error);
      setIsLoading(false);
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error("Unknown error during registration") 
      };
    }
  };

  const signOut = async () => {
    try {
      console.log("Sign out attempt");
      setIsLoading(true);
      
      // Clear state first
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsAuthenticated(false);
      
      // Clean up auth data
      cleanupSupabaseState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload
      window.location.href = PATHS.LOGIN;
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
      setIsLoading(false);
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isAuthenticated,
        userRole,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
