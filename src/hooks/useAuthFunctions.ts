
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface UseAuthFunctionsProps {
  setIsLoading: (isLoading: boolean) => void;
  toast: ReturnType<typeof useToast>["toast"];
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
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error("Error during sign in:", error);
      toast({
        title: "Erro ao fazer login",
        description: error?.message || "Ocorreu um erro durante o login",
        variant: "destructive",
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
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive",
        });
        return { data: null, error };
      }
      
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu email para confirmar sua conta",
      });
      
      return { data, error: null };
    } catch (error: any) {
      console.error("Error during sign up:", error);
      toast({
        title: "Erro ao criar conta",
        description: error?.message || "Ocorreu um erro ao criar sua conta",
        variant: "destructive",
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
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao encerrar sua sessão",
        variant: "destructive",
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
