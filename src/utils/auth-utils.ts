
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
 * Clean up auth state to prevent limbo states
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  if (typeof window !== "undefined" && window.sessionStorage) {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};
