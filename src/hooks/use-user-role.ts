
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (profile) {
      setUserRole(profile.role);
      setIsRoleLoading(false);
    } else if (!authLoading && !profile) {
      setIsRoleLoading(false);
    }
  }, [profile, authLoading]);
  
  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
