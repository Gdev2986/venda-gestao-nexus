
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
      return { user: null, session: null, error };
    }
    
    return {
      user: data.session?.user || null,
      session: data.session,
      error: null
    };
  } catch (error) {
    return { user: null, session: null, error };
  }
};

/**
 * Gets the current user ID from the session
 */
export const getUserId = (): string | null => {
  try {
    // Get user from localStorage if available
    const userSession = localStorage.getItem('supabase.auth.token');
    if (userSession) {
      const parsedSession = JSON.parse(userSession);
      return parsedSession?.currentSession?.user?.id || null;
    }
    
    // Alternative approach to get user ID
    const user = supabase.auth.getUser();
    return user?.data?.user?.id || null;
  } catch (error) {
    return null;
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
    // Silent error
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
      return null;
    }
    
    return data?.role as UserRole || null;
  } catch (error) {
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
  } catch (error) {
    // Silent error
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
      // Silent error
    }
    
    // Force page reload for a clean state
    window.location.href = '/';
    
    return true;
  } catch (error) {
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
      return null;
    }
    
    return data.session;
  } catch (error) {
    return null;
  }
};
