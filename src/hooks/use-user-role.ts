
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);

  // Normalize role to our enum type
  const normalizeRole = (role: string): UserRole => {
    switch(role?.toUpperCase()) {
      case "ADMIN":
        return UserRole.ADMIN;
      case "FINANCIAL":
        return UserRole.FINANCIAL;
      case "LOGISTICS":
        return UserRole.LOGISTICS;
      case "PARTNER":
        return UserRole.PARTNER;
      default:
        return UserRole.CLIENT;
    }
  };

  // Function to retrieve user role
  const fetchUserRole = useCallback(async () => {
    if (!user?.id) return;

    // Check session storage first to avoid unnecessary database calls
    const cachedRole = sessionStorage.getItem(`user_role_${user.id}`);
    
    if (cachedRole) {
      console.info('useUserRole - Using cached role:', cachedRole);
      setUserRole(normalizeRole(cachedRole));
      setIsRoleLoading(false);
      return;
    }

    console.info('useUserRole - Fetching user role from database for user ID:', user.id);
    
    try {
      const { data, error } = await supabase
        .rpc('get_user_role', { user_id: user.id });

      if (error) {
        console.error('Error fetching user role:', error);
        setIsRoleLoading(false);
        return;
      }

      const role = data || 'CLIENT';
      console.info('useUserRole - Database role:', role, 'Normalized role:', normalizeRole(role));
      
      // Store in session storage to avoid frequent db calls
      sessionStorage.setItem(`user_role_${user.id}`, role);
      
      setUserRole(normalizeRole(role));
    } catch (error) {
      console.error('Error in useUserRole hook:', error);
    } finally {
      setIsRoleLoading(false);
    }
  }, [user?.id]);

  // Clear cache on logout
  const clearRoleCache = useCallback(() => {
    if (user?.id) {
      sessionStorage.removeItem(`user_role_${user.id}`);
    }
  }, [user?.id]);

  // Initialize role when auth state changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        fetchUserRole();
      } else {
        // If no user, reset to default and clear loading state
        setUserRole(UserRole.CLIENT);
        setIsRoleLoading(false);
      }
    }

    // Clear role cache when component unmounts or when user changes
    return () => {
      clearRoleCache();
    };
  }, [authLoading, user, fetchUserRole, clearRoleCache]);

  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading,
    refreshRole: fetchUserRole
  };
};
