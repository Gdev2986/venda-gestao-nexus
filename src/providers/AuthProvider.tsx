
import * as React from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
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

  // Load user profile and role
  const loadUserProfile = React.useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error loading user profile:", error);
        return;
      }
      
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
        
        // Check password change status
        const needsChange = await AuthService.needsPasswordChange();
        setNeedsPasswordChange(needsChange);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  }, []);

  // Initialize auth
  React.useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            setSession(null);
            setUser(null);
            setUserRole(null);
            setProfile(null);
            setIsLoading(false);
          }
          return;
        }
        
        if (session?.user && mounted) {
          console.log("User found in session:", session.user.email);
          setSession(session);
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          console.log("No user session found");
          if (mounted) {
            setSession(null);
            setUser(null);
            setUserRole(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setUserRole(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        
        if (!mounted) return;
        
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await loadUserProfile(newSession.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
          setNeedsPasswordChange(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile]);

  // Refresh session data
  const refreshSession = React.useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      const currentSession = data.session;
      setSession(currentSession);
      setUser(currentSession?.user || null);
      
      if (currentSession?.user) {
        await loadUserProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setUserRole(null);
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  }, [loadUserProfile]);

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
