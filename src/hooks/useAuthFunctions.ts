
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { toast as ToastFunction } from "sonner";

interface UseAuthFunctionsProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: typeof ToastFunction; // Use specific type for toast function
  navigate: NavigateFunction;
}

export const useAuthFunctions = ({ setIsLoading, toast, navigate }: UseAuthFunctionsProps) => {
  // Sign in function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast("Erro ao fazer login", {
          description: error.message,
        });
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error during sign in:", error);
      toast("Erro ao fazer login", {
        description: error?.message || "Ocorreu um erro durante o login",
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      if (error) {
        toast("Erro ao criar conta", {
          description: error.message,
        });
        return { data: null, error };
      }
      
      toast("Conta criada com sucesso", {
        description: "Verifique seu email para confirmar sua conta",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error during sign up:", error);
      toast("Erro ao criar conta", {
        description: error?.message || "Ocorreu um erro ao criar sua conta",
      });
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    
    try {
      await supabase.auth.signOut();
      navigate(PATHS.LOGIN);
    } catch (error) {
      console.error("Error during sign out:", error);
      toast("Erro ao sair", {
        description: "Ocorreu um erro ao encerrar sua sessão",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    signIn,
    signUp,
    signOut,
  };
};
