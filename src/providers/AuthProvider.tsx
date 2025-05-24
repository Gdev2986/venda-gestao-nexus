
import * as React from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { fetchUserRole } from "@/utils/auth-utils";
import { AuthService } from "@/services/auth.service";
import { UserProfile } from "@/contexts/auth-types";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  profile: UserProfile | null;
  userRole: UserRole | null;
  needsPasswordChange: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  refreshSession: () => Promise<void>;
  changePasswordAndActivate: (newPassword: string) => Promise<boolean>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  profile: null,
  userRole: null,
  needsPasswordChange: false,
  signIn: async () => ({ data: null, error: null }),
  signUp: async () => ({ data: null, error: null }),
  signOut: async () => ({ error: null }),
  refreshSession: async () => {},
  changePasswordAndActivate: async () => false,
});

export const useAuth = () => React.useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [userRole, setUserRole] = React.useState<UserRole | null>(null);
  const [needsPasswordChange, setNeedsPasswordChange] = React.useState<boolean>(false);
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  // Check if current user needs password change
  const checkPasswordChangeStatus = React.useCallback(async (userId: string) => {
    try {
      const needsChange = await AuthService.needsPasswordChange();
      setNeedsPasswordChange(needsChange);
      return needsChange;
    } catch (error) {
      console.error("Error checking password change status:", error);
      return false;
    }
  }, []);

  // Fetch user profile and role
  const loadUserProfile = React.useCallback(async (userId: string) => {
    try {
      // Fetch profile data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role as UserRole,
          phone: data.phone,
          created_at: data.created_at,
          status: data.status
        };
        
        setProfile(userProfile);
        setUserRole(data.role as UserRole);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }, []);

  // Refresh session data
  const refreshSession = React.useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      const currentSession = data.session;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        // Use setTimeout to defer these calls and prevent deadlocks
        setTimeout(async () => {
          await loadUserProfile(currentSession.user.id);
          await checkPasswordChangeStatus(currentSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setUserRole(null);
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [loadUserProfile, checkPasswordChangeStatus]);

  React.useEffect(() => {
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          // Use setTimeout to defer these calls and prevent deadlocks
          setTimeout(async () => {
            await loadUserProfile(newSession.user.id);
            await checkPasswordChangeStatus(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
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
  }, [loadUserProfile, checkPasswordChangeStatus, refreshSession]);

  // Implement changePasswordAndActivate method
  const changePasswordAndActivate = async (newPassword: string): Promise<boolean> => {
    return AuthService.changePasswordAndActivate(newPassword);
  };

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
    profile,
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    signIn,
    signUp,
    signOut,
    refreshSession,
    changePasswordAndActivate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
