import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, getAuthData, setAuthData } from "@/utils/auth-utils";

// Function to normalize role values 
const normalizeUserRole = (role: any): UserRole => {
  if (!role) return UserRole.CLIENT; // Default fallback
  
  // If it's already a valid UserRole enum value, return it
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  
  // Convert to uppercase string for comparison
  const upperRole = typeof role === 'string' ? role.toString().toUpperCase() : '';
  
  // Map to correct UserRole enum value
  switch (upperRole) {
    case "ADMIN": return UserRole.ADMIN;
    case "CLIENT": return UserRole.CLIENT;
    case "PARTNER": return UserRole.PARTNER;
    case "FINANCIAL": return UserRole.FINANCIAL;
    case "LOGISTICS": return UserRole.LOGISTICS;
    case "MANAGER": return UserRole.MANAGER;
    case "FINANCE": return UserRole.FINANCE;
    case "SUPPORT": return UserRole.SUPPORT;
    case "USER": return UserRole.USER;
    default: return UserRole.CLIENT;
  }
};

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.CLIENT); // Default to CLIENT
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { user, signOut } = useAuth();
  
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
          setUserRole(normalizeUserRole(cachedRole));
          setIsRoleLoading(false);
        }
        
        // Always verify with database to ensure role is current
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          // If it's an authentication error or not found, log out
          if (error.code === 'PGRST116' || error.code === '404') {
            cleanupAuthState();
            await signOut();
            return;
          }
          
          // If there's an error but we have a cached role, keep using it
          if (!cachedRole) {
            setUserRole(UserRole.CLIENT);
          }
        } else if (data && data.role) {
          // Normalize the role to ensure it matches our enum
          const normalizedRole = normalizeUserRole(data.role);
          setUserRole(normalizedRole);
          
          // Store in sessionStorage for persistence
          setAuthData("userRole", normalizedRole);
        } else {
          if (!cachedRole) {
            setUserRole(UserRole.CLIENT);
          }
        }
      } catch (error) {
        // In case of error, try to log out to clear state
        cleanupAuthState();
      } finally {
        setIsRoleLoading(false);
      }
    };

    // Fetch profile when user changes
    fetchUserRole();
  }, [user, signOut]);

  const updateUserRole = (role: UserRole) => {
    const normalizedRole = normalizeUserRole(role);
    setUserRole(normalizedRole);
    setAuthData("userRole", normalizedRole);
  };

  // Renamed isLoading to isRoleLoading for clarity and compatibility
  return { userRole, isLoading: isRoleLoading, isRoleLoading, updateUserRole };
};
