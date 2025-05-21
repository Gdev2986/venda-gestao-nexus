
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { fetchUserRole } from "@/utils/auth-utils";
import { AuthService } from "@/services/auth.service";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  needsPasswordChange: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  needsPasswordChange: false,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  refreshSession: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = useState<boolean>(false);

  // Check if current user needs password change
  const checkPasswordChangeStatus = useCallback(async (userId: string) => {
    try {
      const needsChange = await AuthService.needsPasswordChange();
      setNeedsPasswordChange(needsChange);
      return needsChange;
    } catch (error) {
      console.error("Error checking password change status:", error);
      return false;
    }
  }, []);

  // Fetch user role
  const loadUserRole = useCallback(async (userId: string) => {
    try {
      const role = await fetchUserRole(userId);
      if (role) {
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  }, []);

  // Refresh session data
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      const session = data.session;
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        // Use setTimeout to defer these calls and prevent deadlocks
        setTimeout(async () => {
          await loadUserRole(session.user.id);
          await checkPasswordChangeStatus(session.user.id);
        }, 0);
      } else {
        setUserRole(null);
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [loadUserRole, checkPasswordChangeStatus]);

  useEffect(() => {
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          // Use setTimeout to defer these calls and prevent deadlocks
          setTimeout(async () => {
            await loadUserRole(newSession.user.id);
            await checkPasswordChangeStatus(newSession.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setNeedsPasswordChange(false);
        }
      }
    );

    // Then check for existing session
    refreshSession().finally(() => {
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserRole, checkPasswordChangeStatus, refreshSession]);

  // Sign in function using the auth service for proper cleanup
  const signIn = async (email: string, password: string) => {
    return AuthService.signIn(email, password);
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      return { data, error };
    } catch (error: any) {
      return { data: null, error };
    }
  };

  // Sign out function using the auth service for proper cleanup
  const signOut = async () => {
    return AuthService.signOut();
  };

  // Calculate if user is authenticated
  const isAuthenticated = !!user && !!session;

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    signIn,
    signUp,
    signOut,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
