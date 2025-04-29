
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types";
import { fetchUserRole } from "@/utils/auth-utils";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("AuthProvider rendering, isLoading:", isLoading, "user:", user?.email, "role:", userRole);

  // Function to fetch user role from profiles table
  const loadUserRole = async (userId: string) => {
    try {
      const role = await fetchUserRole(userId);
      console.log("Fetched role for user:", userId, "role:", role);
      if (role) {
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  useEffect(() => {
    console.log("Setting up auth listener");
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event);
        // No async operations here to prevent race conditions
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle auth events with setTimeout to avoid calling Supabase inside the callback
        if (event === "SIGNED_IN" && newSession?.user) {
          console.log("Signed in event detected");
          setTimeout(() => {
            loadUserRole(newSession.user.id);
            toast({
              title: "Autenticado com sucesso",
              description: "Bem-vindo à SigmaPay!",
            });
          }, 0);
        }
        
        if (event === "SIGNED_OUT") {
          console.log("Signed out event detected");
          setUserRole(null);
          setTimeout(() => {
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
        console.log("Checking initial session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          throw error;
        }
        
        console.log("Initial session check complete:", !!data.session);
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Load user role if we have a session
        if (data.session?.user) {
          await loadUserRole(data.session.user.id);
        }
      } catch (error) {
        console.error("Error during initial session check:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initialSessionCheck();

    return () => {
      console.log("Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, [toast]); // Only run this effect once on mount

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Enhanced error handling
        console.error("Login error:", error);
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
        console.log("Sign in successful, fetching user role");
        await loadUserRole(data.user.id);
        
        console.log("Navigating based on role:", userRole);
        // Use setTimeout to avoid race conditions with onAuthStateChange
        setTimeout(() => {
          if (userRole === UserRole.CLIENT) {
            navigate("/client/dashboard");
          } else {
            navigate("/dashboard");
          }
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
      console.log("Sign up attempt for:", email);
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

      console.log("Sign up response:", { error, user: data?.user ? true : false });

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
      console.log("Sign out attempt");
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state immediately
      setUser(null);
      setSession(null);
      setUserRole(null);
      
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
