
import React from "react";
import { UserRole } from "@/types";
import LogisticsLayout from "./LogisticsLayout";
import MainLayout from "./MainLayout";
import { useAuth } from "@/hooks/use-auth";

interface AdminLayoutSelectorProps {
  children: React.ReactNode;
}

// Custom layout selector based on user role
const AdminLayoutSelector: React.FC<AdminLayoutSelectorProps> = ({ children }) => {
  const { userRole } = useAuth();
  
  // Use LogisticsLayout for Logistics users
  if (userRole === UserRole.LOGISTICS) {
    return <LogisticsLayout>{children}</LogisticsLayout>;
  }
  
  // Use default MainLayout for other roles
  return <MainLayout>{children}</MainLayout>;
};

export default AdminLayoutSelector;
