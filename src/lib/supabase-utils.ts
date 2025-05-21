
import { supabase } from "@/integrations/supabase/client";

/**
 * Function to generate a UUID using the browser's crypto API
 * Returns a string synchronously instead of a Promise
 */
export const generateUuid = (): string => {
  try {
    // Use the browser's crypto API to generate a UUID synchronously
    return crypto.randomUUID();
  } catch (err) {
    console.error("Error generating UUID:", err);
    // Fallback to a simple random string if crypto.randomUUID() is not available
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
};
