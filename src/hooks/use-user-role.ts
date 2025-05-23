
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, profile, userRole: contextUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);
  const [userRole, setUserRole] = useState<UserRole | null>(contextUserRole);

  useEffect(() => {
    // Debug logs to trace the issue
    console.log("useUserRole debug:", {
      contextUserRole,
      profileRole: profile?.role,
      authLoading,
      user: !!user
    });
    
    if (contextUserRole) {
      setUserRole(contextUserRole);
      setIsRoleLoading(false);
    } else if (profile?.role) {
      setUserRole(profile.role);
      setIsRoleLoading(false);
    } else if (!authLoading && user) {
      // Fallback: if we have a user but no role yet, default to USER
      console.warn("No role found for authenticated user, using fallback");
      setUserRole(UserRole.USER);
      setIsRoleLoading(false);
    } else if (!authLoading) {
      setIsRoleLoading(false);
    }
  }, [profile, authLoading, contextUserRole, user]);
  
  return {
    userRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
