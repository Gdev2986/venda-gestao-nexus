
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

// Export the AuthContext so it can be imported directly
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Generate a unique device ID for this browser
  const getDeviceId = () => {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  };

  // Track the session in our database
  const trackSession = async (userId: string) => {
    try {
      const deviceId = getDeviceId();
      
      // Record or update the session in our user_sessions table
      await supabase
        .from('user_sessions')
        .upsert(
          {
            user_id: userId,
            device_id: deviceId,
            last_active: new Date().toISOString(),
            metadata: { 
              user_agent: navigator.userAgent,
              platform: navigator.platform
            }
          },
          { onConflict: 'user_id, device_id' }
        );
    } catch (error) {
      console.error("Error tracking session:", error);
    }
  };

  // Set up authentication state listener
  useEffect(() => {
    // Set up auth state listener FIRST (important for order)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Synchronous updates to prevent deadlocks
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle auth events with setTimeout to avoid calling Supabase inside the callback
        if (event === "SIGNED_IN" && newSession?.user) {
          setTimeout(() => {
            trackSession(newSession.user.id);
            toast({
              title: "Autenticado com sucesso",
              description: "Bem-vindo à plataforma!",
            });
          }, 0);
        }
        
        if (event === "SIGNED_OUT") {
          // Clear local storage for clean logout
          setTimeout(() => {
            localStorage.removeItem('userRole');
            
            toast({
              title: "Desconectado",
              description: "Você foi desconectado com sucesso.",
            });
          }, 0);
        }
      }
    );

    // Check for existing session AFTER setting up listeners
    const initialSessionCheck = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Track session if user is logged in
        if (data.session?.user) {
          await trackSession(data.session.user.id);
        }
      } catch (error) {
        console.error("Error during initial session check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialSessionCheck();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]); // Only run this effect once on mount

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Enhanced error handling with user-friendly messages
        let errorMessage = "Ocorreu um erro durante a autenticação";
        
        if (error.message === "Invalid login credentials") {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Database error")) {
          errorMessage = "Erro de conexão com o servidor. Tente novamente mais tarde.";
        }
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
      
      if (data.user) {
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          navigate("/dashboard");
        }, 0);
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    try {
      setIsLoading(true);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        let errorMessage = "Ocorreu um erro durante o registro";
        
        if (error.message.includes("already registered")) {
          errorMessage = "Este email já está registrado. Tente fazer login.";
        }
        
        toast({
          title: "Erro ao registrar",
          description: errorMessage,
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Registro realizado com sucesso",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Error during registration:", error);
      // Toast is shown in the error handler above
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear role from local storage first
      localStorage.removeItem('userRole');
      localStorage.removeItem('sb-yjzwusatnkebfpsvvffz-auth-token');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      
      navigate("/");
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
