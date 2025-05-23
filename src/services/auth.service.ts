
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/auth-utils";
import { UserRole } from "@/types";

export const AuthService = {
  /**
   * Check if the current user needs to change their password
   */
  async needsPasswordChange(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return false;
      
      const { data, error } = await supabase.rpc('user_needs_password_change', {
        user_uuid: session.user.id
      });
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error("Error checking if user needs password change:", error);
      return false;
    }
  },
  
  /**
   * Update password and mark user as active after first login
   */
  async changePasswordAndActivate(newPassword: string): Promise<boolean> {
    try {
      // Update the password through Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (passwordError) throw passwordError;
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      
      // Mark user as active and remove password_reset_required flag
      const { error: updateError } = await supabase.rpc('update_user_after_password_change', {
        user_uuid: user.id
      });
      
      if (updateError) throw updateError;
      
      return true;
    } catch (error) {
      console.error("Error changing password and activating user:", error);
      return false;
    }
  },
  
  /**
   * Clean up auth state to prevent limbo states
   */
  cleanupAuthState() {
    try {
      // Remove standard auth tokens
      localStorage.removeItem('supabase.auth.token');
      
      // Remove all Supabase auth keys from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Remove from sessionStorage if in use
      if (typeof window !== "undefined" && window.sessionStorage) {
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      
      console.log("Auth state cleaned up");
    } catch (error) {
      console.error("Error cleaning up auth state:", error);
    }
  },
  
  /**
   * Sign in with email and password
   * Set up with proper auth state cleanup to prevent limbo state
   */
  async signIn(email: string, password: string) {
    try {
      // Clean up existing auth state to prevent limbo
      this.cleanupAuthState();
      
      // Try to sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log("Could not perform global sign out before login:", err);
      }
      
      // Sign in with provided credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error };
    }
  },

  /**
   * Sign out properly
   */
  async signOut() {
    try {
      this.cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload to clear any state
      window.location.href = '/login';
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  },
  
  /**
   * Check if an email exists in the profiles table
   * Used to validate Google login access
   */
  async checkEmailAuthorized(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error("Error checking authorized email:", error);
      }
      
      return !!data;
    } catch (error) {
      console.error("Exception checking authorized email:", error);
      return false;
    }
  },
  
  /**
   * Handle Google OAuth response
   * Checks if the user is authorized (exists in profiles)
   */
  async handleGoogleAuthResponse(): Promise<{success: boolean, error?: string}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.email) {
        return { success: false, error: "Falha na autenticação com Google." };
      }
      
      // Check if the email is authorized in the system
      const isAuthorized = await this.checkEmailAuthorized(session.user.email);
      
      if (!isAuthorized) {
        // Sign out as this user is not authorized
        await supabase.auth.signOut();
        return { 
          success: false, 
          error: "Conta não autorizada. Contate o administrador." 
        };
      }
      
      return { success: true };
    } catch (error: any) {
      console.error("Error handling Google auth response:", error);
      return { 
        success: false, 
        error: error.message || "Erro ao processar login com Google." 
      };
    }
  }
};
