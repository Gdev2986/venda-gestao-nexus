
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to generate a UUID using Supabase's extension
 */
export const generateUuid = async (): Promise<string> => {
  try {
    // Call the correct RPC function "generate_uuid" 
    const { data, error } = await supabase.rpc("generate_uuid");
    
    if (error) {
      throw new Error(`Failed to generate UUID: ${error.message}`);
    }
    
    return data as string;
  } catch (err) {
    console.error("Error generating UUID:", err);
    // Fallback to client-side UUID generation
    return crypto.randomUUID();
  }
};
