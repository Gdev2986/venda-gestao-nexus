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
      // Se houver erro ao carregar o perfil, limpa o estado
      setProfile(null);
      setUserRole(null);
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
        await loadUserProfile(currentSession.user.id);
        await checkPasswordChangeStatus(currentSession.user.id);
      } else {
        setProfile(null);
        setUserRole(null);
        setNeedsPasswordChange(false);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      // Em caso de erro, limpa o estado
      setSession(null);
      setUser(null);
      setProfile(null);
      setUserRole(null);
      setNeedsPasswordChange(false);
    }
  }, [loadUserProfile, checkPasswordChangeStatus]);

  React.useEffect(() => {
    let mounted = true;

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          await loadUserProfile(newSession.user.id);
          await checkPasswordChangeStatus(newSession.user.id);
        } else {
          setProfile(null);
          setUserRole(null);
          setNeedsPasswordChange(false);
        }
      }
    );

    // Check for existing session
    refreshSession().finally(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadUserProfile, checkPasswordChangeStatus, refreshSession]);

  // Implement changePasswordAndActivate method
  const changePasswordAndActivate = async (newPassword: string): Promise<boolean> => {
    return AuthService.changePasswordAndActivate(newPassword);
  };

  // Sign in function using the auth service
  const signIn = async (email: string, password: string) => {
    return AuthService.signIn(email, password);
  };

  // Sign out function using the auth service
  const signOut = async () => {
    return AuthService.signOut();
  };

  // Calculate if user is authenticated
  const isAuthenticated = !!user && !!session && !!userRole;

  const value = {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    signIn,
    signOut,
    refreshSession,
    changePasswordAndActivate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
