
import { supabase } from "@/integrations/supabase/client";

/**
 * Generates a UUID using Supabase's generate_uuid function
 * @returns A promise that resolves to a UUID string
 */
export const generateUuid = async (): Promise<string> => {
  try {
    const { data, error } = await supabase.rpc('generate_uuid');
    
    if (error) {
      console.error('Error generating UUID:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in generateUuid:', error);
    throw error;
  }
};
