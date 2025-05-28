
import { supabase } from "@/integrations/supabase/client";

export const changePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });
  
  if (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  
  if (error) {
    throw new Error(error.message);
  }
};
