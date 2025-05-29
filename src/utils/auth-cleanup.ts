
/**
 * Utility functions for cleaning up Supabase auth state
 */

/**
 * Cleans up all Supabase authentication related data from storage
 */
export const cleanupSupabaseState = () => {
  try {
    console.log("Starting auth state cleanup...");
    
    // Clear standard auth data
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    localStorage.removeItem('userRole');
    
    // Clear all Supabase keys from localStorage
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('supabase-auth-token')) {
        console.log("Removing localStorage key:", key);
        localStorage.removeItem(key);
      }
    });
    
    // Clear from sessionStorage if being used
    const sessionStorageKeys = Object.keys(sessionStorage);
    sessionStorageKeys.forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-') || key.startsWith('supabase-auth-token')) {
        console.log("Removing sessionStorage key:", key);
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear any cached user data
    sessionStorage.removeItem('userProfile');
    localStorage.removeItem('userProfile');
    
    console.log("Auth state cleanup complete");
  } catch (error) {
    console.error("Error during auth state cleanup:", error);
  }
};

/**
 * Força uma limpeza completa e redirecionamento
 */
export const forceLogout = () => {
  cleanupSupabaseState();
  
  // Aguarda um pouco para garantir que a limpeza foi concluída
  setTimeout(() => {
    window.location.href = '/login';
  }, 100);
};
