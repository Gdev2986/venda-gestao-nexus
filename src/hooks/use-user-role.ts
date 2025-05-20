
import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, profile, userRole: contextUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = React.useState<boolean>(authLoading);
  const [userRole, setUserRole] = React.useState<UserRole | null>(contextUserRole);

  React.useEffect(() => {
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
