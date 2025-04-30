
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getAuthData, setAuthData } from "@/utils/auth-utils";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT); // Default to CLIENT, safer than admin
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUserRole = async () => {
      // If there's no user, don't fetch profile
      if (!user) {
        setUserRole(UserRole.CLIENT); // Default to client when not logged in
        return;
      }

      try {
        // Always verify with database to ensure role is current
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data && data.role) {
          const role = data.role as UserRole;
          setUserRole(role);
          // Store in sessionStorage (not localStorage) for better isolation
          sessionStorage.setItem("userRole", role);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    // Fetch profile when user changes
    fetchUserRole();
  }, [user]);

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    sessionStorage.setItem("userRole", role);
  };

  return { userRole, updateUserRole };
};
