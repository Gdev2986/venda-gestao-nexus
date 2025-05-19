
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, session, userRole: authUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);

  useEffect(() => {
    // Set role loading state based on authentication status
    if (!authLoading) {
      setIsRoleLoading(false);
    }
  }, [authLoading, session, user, authUserRole]);
  
  return {
    userRole: session ? authUserRole : null, // Only return role if session exists
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
