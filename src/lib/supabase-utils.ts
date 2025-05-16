
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate a UUID using Supabase RPC
 * @returns The generated UUID string or null if there was an error
 */
export const generateUuid = async (): Promise<string | null> => {
  try {
    // Call the generate_uuid RPC function
    const { data, error } = await supabase.rpc('generate_uuid');
    
    if (error) {
      console.error("Error generating UUID:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception when generating UUID:", error);
    return null;
  }
};

/**
 * Get the currently logged-in user's role
 * @returns The user's role string or null if there was an error
 */
export const getUserRole = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.rpc('get_user_role');
    
    if (error) {
      console.error("Error getting user role:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Exception when getting user role:", error);
    return null;
  }
};
