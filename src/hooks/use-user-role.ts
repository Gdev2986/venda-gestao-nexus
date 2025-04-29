
import { useState, useEffect } from "react";
import { UserRole } from "@/types";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.ADMIN);

  // In a real application, this would check the authenticated user's role
  // For now, we're defaulting to ADMIN for demo purposes
  
  useEffect(() => {
    // Here you would typically fetch the user's role from your authentication system
    // For example: supabase.auth.getUser().then(({ data }) => { ... })
    
    // Mock implementation
    const storedRole = localStorage.getItem("userRole");
    if (storedRole && Object.values(UserRole).includes(storedRole as UserRole)) {
      setUserRole(storedRole as UserRole);
    }
  }, []);

  const updateUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem("userRole", role);
  };

  return { userRole, updateUserRole };
};
