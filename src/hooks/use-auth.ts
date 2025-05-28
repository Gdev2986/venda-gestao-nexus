
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

interface UseAuthReturn {
  userRole: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        console.log("useAuth: Getting session...");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("useAuth: Session error:", error);
          if (mounted) {
            setUserRole(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (!session?.user) {
          console.log("useAuth: No session found");
          if (mounted) {
            setUserRole(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        console.log("useAuth: Session found, getting user role...");
        setIsAuthenticated(true);

        // Get user role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("useAuth: Profile error:", profileError);
          // If profile doesn't exist, default to CLIENT role
          if (mounted) {
            setUserRole(UserRole.CLIENT);
            setIsLoading(false);
          }
          return;
        }

        const role = profile?.role as UserRole;
        console.log("useAuth: User role found:", role);
        
        if (mounted) {
          setUserRole(role || UserRole.CLIENT);
          setIsLoading(false);
        }

      } catch (error) {
        console.error("useAuth: Unexpected error:", error);
        if (mounted) {
          setUserRole(null);
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("useAuth: Auth state changed:", event);
        
        if (event === 'SIGNED_OUT' || !session) {
          if (mounted) {
            setUserRole(null);
            setIsAuthenticated(false);
            setIsLoading(false);
          }
          return;
        }

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await getSession();
        }
      }
    );

    getSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    userRole,
    isLoading,
    isAuthenticated,
    logout
  };
};
