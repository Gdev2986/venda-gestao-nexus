
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to generate a UUID using Supabase's extension
 */
export const generateUuid = async (): Promise<string> => {
  try {
    // Using a direct UUID generation instead of RPC call since there seems to be an issue
    // with the RPC function name "generate_uuid"
    return crypto.randomUUID();
  } catch (err) {
    console.error("Error generating UUID:", err);
    // Fallback to client-side UUID generation
    return crypto.randomUUID();
  }
};
