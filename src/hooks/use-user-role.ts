
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const { user, userRole: authUserRole, isLoading: authLoading } = useAuth();
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(authLoading);

  // We now use the role from the AuthContext directly
  // which is populated after authentication is confirmed
  
  return {
    userRole: authUserRole,
    isRoleLoading,
    isLoading: authLoading || isRoleLoading
  };
};
