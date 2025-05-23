
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/utils/auth-utils";

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
   * Sign in with email and password
   * Set up with proper auth state cleanup to prevent limbo state
   */
  async signIn(email: string, password: string) {
    try {
      // Clean up existing auth state to prevent limbo
      cleanupAuthState();
      
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
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/login';
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  }
};
