
/**
 * Utility functions for authentication
 */

import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

/**
 * Checks if there is an active session and returns the user if available
 */
export const checkSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error checking session:", error);
      return { user: null, session: null, error };
    }
    
    return {
      user: data.session?.user || null,
      session: data.session,
      error: null
    };
  } catch (error) {
    console.error("Exception checking session:", error);
    return { user: null, session: null, error };
  }
};

/**
 * Helper to safely set auth related data in localStorage
 */
export const setAuthData = (key: string, value: any) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

/**
 * Helper to safely get auth related data from localStorage
 */
export const getAuthData = (key: string) => {
  try {
    if (typeof window !== "undefined") {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

/**
 * Fetch user role directly from database
 */
export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
    
    return data?.role as UserRole || null;
  } catch (error) {
    console.error('Exception fetching user role:', error);
    return null;
  }
};

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: UserRole, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(userRole);
};

/**
 * Thorough cleanup of auth state to prevent auth limbo states
 */
export const cleanupAuthState = () => {
  try {
    // Clear all auth-related tokens from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    // Also clear from sessionStorage if being used
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Clear application specific role/auth data
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    
    console.log('Auth state cleaned up');
  } catch (error) {
    console.error('Error cleaning up auth state:', error);
  }
};

/**
 * Secure sign-out with cleanup
 */
export const secureSignOut = async () => {
  try {
    // Clean up first
    cleanupAuthState();
    
    // Attempt global sign-out - ignore errors
    try {
      await supabase.auth.signOut({ scope: 'global' });
    } catch (err) {
      console.error('Error during sign out:', err);
    }
    
    // Force page reload for a clean state
    window.location.href = '/';
    
    return true;
  } catch (error) {
    console.error('Exception during secure sign out:', error);
    return false;
  }
};

/**
 * Safely refresh session token
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error('Exception refreshing session:', error);
    return null;
  }
};
