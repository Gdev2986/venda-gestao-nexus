
/**
 * Utility functions for cleaning up Supabase auth state
 */

/**
 * Cleans up all Supabase authentication related data from storage
 */
export const cleanupSupabaseState = () => {
  try {
    // Clear standard auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Clear all Supabase keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if being used
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth state cleanup complete");
  } catch (error) {
    console.error("Error during auth state cleanup:", error);
  }
};
