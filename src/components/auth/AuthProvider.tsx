
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { 
    setUser, 
    setSession, 
    setUserRole, 
    initializeAuth 
  } = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          // Fetch user role when user signs in
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
              
            if (profile?.role) {
              setUserRole(profile.role as UserRole);
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            setUserRole(null);
          }
        } else {
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, setSession, setUserRole, initializeAuth]);

  return <>{children}</>;
};
