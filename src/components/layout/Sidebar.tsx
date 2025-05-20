
import React, { memo } from "react";
import SidebarComponent from "./sidebar/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";

// Memoize the Sidebar component to prevent unnecessary re-renders
const Sidebar: React.FC = memo(() => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userRole } = useUserRole();
  
  // Safe fallback when userRole is null
  const safeUserRole = userRole || UserRole.ADMIN;
  
  return (
    <SidebarComponent 
      isOpen={!isMobile} 
      isMobile={isMobile} 
      onClose={() => {}} 
      userRole={safeUserRole} 
    />
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
