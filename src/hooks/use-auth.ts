
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  avatar?: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!session;
  const userRole = user?.role || null;

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email, name, role, phone, avatar')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      if (profileData) {
        const userData: UserData = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role
        };

        const userProfileData: UserProfile = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
          role: profileData.role,
          phone: profileData.phone,
          avatar: profileData.avatar
        };

        setUser(userData);
        setProfile(userProfileData);
      }
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error: any) {
      setError(error.message);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setError(null);
  };

  return {
    user,
    session,
    profile,
    isLoading,
    error,
    isAuthenticated,
    userRole,
    signIn,
    signOut
  };
}
