
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { name: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST - ordem crítica para evitar loops
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Atualizações síncronas apenas
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Tratamento de eventos de autenticação
        if (event === "SIGNED_IN") {
          // Usando setTimeout para evitar chamadas Supabase dentro do callback
          setTimeout(() => {
            toast({
              title: "Autenticado com sucesso",
              description: "Bem-vindo de volta à SigmaPay!",
            });
          }, 0);
        }
        
        if (event === "SIGNED_OUT") {
          setTimeout(() => {
            toast({
              title: "Desconectado",
              description: "Você foi desconectado com sucesso.",
            });
          }, 0);
        }
      }
    );

    // DEPOIS verificar por sessão existente
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Tratamento de erro melhorado
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
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Erro durante login:", error);
      // O toast já é exibido acima
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: { name: string }) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
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
      console.error("Erro durante registro:", error);
      // O toast já é exibido acima
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
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
