
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cleanupSupabaseState } from "@/contexts/AuthContext";

interface AuthResponse {
  success: boolean;
  error: string | null;
}

export const useAuthActions = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailPasswordLogin = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setIsLoading(true);
      console.log("Login form - attempting login with:", email);
      
      // Clean up any existing auth data first
      cleanupSupabaseState();
      
      // Add a short delay to ensure cleanup completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        // Try global logout before login to ensure clean state
        await supabase.auth.signOut({ scope: 'global' });
        console.log("Global sign-out completed");
      } catch (error) {
        console.log("Error during global sign-out (non-critical):", error);
        // Continue even if this fails
      }

      console.log("Starting login process");
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login failed:", error.message);
        throw error;
      }

      console.log("Login successful, redirecting...");
      
      // Use window.location for more reliable redirect in mobile environments
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during login:", error);
      
      // Handle specific error types
      if (error.message && error.message.includes("Database error")) {
        return { 
          success: false, 
          error: "Erro de conexão com o servidor. Por favor, tente novamente mais tarde." 
        };
      } else if (error.message && error.message.includes("Invalid login credentials")) {
        return { 
          success: false, 
          error: "Email ou senha incorretos. Por favor, verifique seus dados." 
        };
      } else {
        return { 
          success: false, 
          error: `Ocorreu um erro inesperado: ${error.message}. Por favor, tente novamente.` 
        };
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log("Starting Google login process");
      
      // Get current URL for redirect
      const currentUrl = window.location.origin;
      console.log("Current URL for redirect:", currentUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/dashboard`
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        throw error;
      }
      
      return { success: true, error: null };
    } catch (error: any) {
      console.error("Error during Google login:", error);
      return { 
        success: false, 
        error: error.message || "Ocorreu um erro durante a autenticação com Google" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleEmailPasswordLogin,
    handleGoogleLogin,
  };
};
