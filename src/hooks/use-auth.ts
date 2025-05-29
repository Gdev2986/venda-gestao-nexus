
import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "ADMIN" | "CLIENT" | "LOGISTICS" | "FINANCIAL";

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

  // Create profile if it doesn't exist
  const createMissingProfile = async (user: User) => {
    try {
      console.log('Creating missing profile for user:', user.id);
      
      const profileData = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário',
        role: 'CLIENT' as UserRole,
        status: 'active',
        password_reset_required: false
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      console.log('Profile created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createMissingProfile:', error);
      return null;
    }
  };

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      console.log('Loading user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        
        // If profile doesn't exist, try to create it
        if (error.code === 'PGRST116' && user) {
          console.log('Profile not found, attempting to create...');
          const createdProfile = await createMissingProfile(user);
          
          if (createdProfile) {
            setUserProfile(createdProfile);
            setUserRole(createdProfile.role);
            setNeedsPasswordChange(false);
            return;
          }
        }
        
        // If we can't create profile, show error and sign out
        toast({
          variant: "destructive",
          title: "Erro de perfil",
          description: "Não foi possível carregar seu perfil. Entre em contato com o suporte.",
        });
        await supabase.auth.signOut();
        return;
      }

      setUserProfile(data);
      setUserRole(data.role);

      // Check if password change is needed
      const needsChange = await checkPasswordChangeRequired(userId);
      setNeedsPasswordChange(needsChange);

    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar perfil do usuário.",
      });
    }
  };

  // Handle sign in
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Starting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Sign in successful for user:', data.user.id);
        await loadUserProfile(data.user.id);
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const signOut = async () => {
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
  };

  // Handle password change completion
  const onPasswordChanged = async () => {
    setNeedsPasswordChange(false);
    if (user) {
      await loadUserProfile(user.id);
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
    userRole,
    loading,
    needsPasswordChange,
    signIn,
    signOut,
    onPasswordChanged,
    isAuthenticated: !!user && !!session,
  };
};
