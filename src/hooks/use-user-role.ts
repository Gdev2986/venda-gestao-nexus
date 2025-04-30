
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Helper for storing and retrieving auth data securely
const getAuthData = (key: string) => {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting ${key} from storage:`, error);
    return null;
  }
};

const setAuthData = (key: string, value: any) => {
  try {
    // Use sessionStorage for auth data for better security
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in storage:`, error);
  }
};

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT); // Default to CLIENT
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUserRole = async () => {
      // Reset role loading state when user changes
      setIsRoleLoading(true);
      
      // If there's no user, don't fetch profile
      if (!user) {
        setUserRole(UserRole.CLIENT); // Default to client when not logged in
        setIsRoleLoading(false);
        return;
      }

      try {
        // First check sessionStorage for cached role
        const cachedRole = getAuthData("userRole");
        
        if (cachedRole && Object.values(UserRole).includes(cachedRole as UserRole)) {
          setUserRole(cachedRole as UserRole);
        }
        
        // Always verify with database to ensure role is current
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setIsRoleLoading(false);
          return;
        }

        if (data && data.role) {
          const role = data.role as UserRole;
          setUserRole(role);
          // Store in sessionStorage for persistence
          setAuthData("userRole", role);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsRoleLoading(false);
      }
    };

    // Fetch profile when user changes
    fetchUserRole();
  }, [user]);

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    setAuthData("userRole", role);
  };

  return { userRole, isRoleLoading, updateUserRole };
};
