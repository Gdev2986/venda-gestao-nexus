
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export const useUserRole = () => {
  const { user, profile, userRole: contextUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);
  const [userRole, setUserRole] = useState<UserRole | null>(contextUserRole);
  const navigate = useNavigate();

  useEffect(() => {
    if (contextUserRole) {
      setUserRole(contextUserRole);
      setIsRoleLoading(false);
    } else if (profile) {
      setUserRole(profile.role);
      setIsRoleLoading(false);
    } else if (!authLoading) {
      setIsRoleLoading(false);
      
      // If authentication is complete but we have no user, redirect to login
      if (!user) {
        console.log("No user found, redirecting to login");
        navigate(PATHS.LOGIN);
      }
      
      // If authentication is complete, we have a user but no role, redirect to login
      if (user && !contextUserRole && !profile?.role) {
        console.error("User is authenticated but has no role, redirecting to login");
        navigate(PATHS.LOGIN);
      }
    }
  }, [profile, authLoading, contextUserRole, user, navigate]);
  
  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
