
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, profile, userRole: contextUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);
  const [userRole, setUserRole] = useState<UserRole | null>(contextUserRole);

  useEffect(() => {
    console.log("useUserRole - Auth data:", {
      user: user?.id,
      profile: profile?.role,
      contextUserRole,
      authLoading
    });

    if (contextUserRole) {
      setUserRole(contextUserRole);
      setIsRoleLoading(false);
    } else if (profile?.role) {
      setUserRole(profile.role);
      setIsRoleLoading(false);
    } else if (!authLoading && !profile) {
      setIsRoleLoading(false);
    }
  }, [profile, authLoading, contextUserRole, user]);
  
  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
