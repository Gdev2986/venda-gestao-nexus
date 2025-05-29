import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types/enums";

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  status: string;
  password_reset_required: boolean;
  temp_access_expires_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPasswordChange, setNeedsPasswordChange] = useState(false);
  const { toast } = useToast();

  // Add these properties for backward compatibility
  const isLoading = loading;
  const isAuthenticated = !!user && !!session;
  const profile = userProfile; // Alias for backward compatibility

  // Check if user needs password change
  const checkPasswordChangeRequired = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('password_reset_required, temp_access_expires_at, status')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking password change requirement:', error);
        return false;
      }

      // Check if password reset is required
      if (data.password_reset_required) {
        // Also check if temp access hasn't expired
        if (data.temp_access_expires_at) {
          const expiresAt = new Date(data.temp_access_expires_at);
          const now = new Date();
          
          if (now > expiresAt) {
            toast({
              variant: "destructive",
              title: "Acesso expirado",
              description: "Seu acesso temporário expirou. Entre em contato com o administrador.",
            });
            await supabase.auth.signOut();
            return false;
          }
        }
        
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in checkPasswordChangeRequired:', error);
      return false;
    }
  };

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        return;
      }

      // Convert the role string to UserRole enum
      const profileWithRole = {
        ...data,
        role: data.role as UserRole
      };

      setUserProfile(profileWithRole);
      setUserRole(data.role as UserRole);

      // Check if password change is needed
      const needsChange = await checkPasswordChangeRequired(userId);
      setNeedsPasswordChange(needsChange);

    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Defer profile loading to avoid potential deadlocks
          setTimeout(() => {
            loadUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
          setUserRole(null);
          setNeedsPasswordChange(false);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    userProfile,
    profile, // Backward compatibility alias
    userRole,
    loading,
    isLoading, // Backward compatibility alias
    isAuthenticated, // Backward compatibility property
    needsPasswordChange,
    signIn: async (email: string, password: string) => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await loadUserProfile(data.user.id);
        }

        return { success: true, error: null };
      } catch (error: any) {
        console.error('Sign in error:', error);
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    },
    signOut: async () => {
      try {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        setUser(null);
        setSession(null);
        setUserProfile(null);
        setUserRole(null);
        setNeedsPasswordChange(false);
      } catch (error: any) {
        console.error('Sign out error:', error);
        toast({
          variant: "destructive",
          title: "Erro ao sair",
          description: error.message,
        });
      } finally {
        setLoading(false);
      }
    },
    onPasswordChanged: async () => {
      setNeedsPasswordChange(false);
      if (user) {
        await loadUserProfile(user.id);
      }
    },
    error: null, // Add error property for compatibility
  };
};
