
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavigateFunction } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { cleanupSupabaseState } from "@/utils/auth-cleanup";

type UseAuthFunctionsProps = {
  setIsLoading: (isLoading: boolean) => void;
  toast: any;
  navigate: NavigateFunction;
};

export const useAuthFunctions = ({ setIsLoading, toast, navigate }: UseAuthFunctionsProps) => {
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      // Clean up any existing auth data before attempting login
      cleanupSupabaseState();
      
      console.log("Sign in attempt for:", email);
      setIsLoading(true);
      
      // Try global logout before login to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Failed to perform global logout before login, continuing...");
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        toast({
          title: "Erro de login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      if (data.user) {
        console.log("Sign in successful");
        // Let the auth state change listener handle redirects
        return { error: null };
      }
      
      setIsLoading(false);
      return { error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      setIsLoading(false);
      return { 
        error: error instanceof Error ? error : new Error("Unknown error during login") 
      };
    }
  }, [setIsLoading, toast]);

  const signUp = useCallback(async (email: string, password: string, metadata?: { name?: string }) => {
    try {
      // Clean up any existing auth data before attempting signup
      cleanupSupabaseState();
      
      console.log("Sign up attempt for:", email);
      setIsLoading(true);
      
      // Try global logout before signup to ensure clean state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata?.name,
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
        return { data: null, error };
      }
      
      toast({
        title: "Registro bem-sucedido",
        description: "Por favor, verifique seu email para confirmar sua conta.",
      });

      navigate(PATHS.HOME);
      setIsLoading(false);
      return { data: data?.user || null, error: null };
    } catch (error: any) {
      console.error("Error during registration:", error);
      setIsLoading(false);
      return { 
        data: null,
        error: error instanceof Error ? error : new Error("Unknown error during registration") 
      };
    }
  }, [setIsLoading, toast, navigate]);

  const signOut = useCallback(async () => {
    try {
      console.log("Sign out attempt");
      setIsLoading(true);
      
      // Clear local state immediately for better UX
      
      // Clean up all auth data
      cleanupSupabaseState();
      
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.error("Error during logout:", error);
      } finally {
        setIsLoading(false);
      }
      
      // Navigate to login page
      navigate(PATHS.LOGIN);
    } catch (error: any) {
      console.error("Error during sign out:", error);
      setIsLoading(false);
      toast({
        title: "Erro ao sair",
        description: error.message || "Ocorreu um erro ao tentar sair",
        variant: "destructive",
      });
    }
  }, [setIsLoading, toast, navigate]);

  return {
    signIn,
    signUp,
    signOut,
  };
};
