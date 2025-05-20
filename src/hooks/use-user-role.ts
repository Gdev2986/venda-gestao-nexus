
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, profile, userRole: contextUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);
  const [userRole, setUserRole] = useState<UserRole | null>(contextUserRole);

  useEffect(() => {
    if (contextUserRole) {
      setUserRole(contextUserRole);
      setIsRoleLoading(false);
    } else if (profile) {
      setUserRole(profile.role);
      setIsRoleLoading(false);
    } else if (!authLoading && !profile) {
      setIsRoleLoading(false);
    }
  }, [profile, authLoading, contextUserRole]);
  
  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
