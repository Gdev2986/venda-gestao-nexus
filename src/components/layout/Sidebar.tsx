
import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { useMediaQuery } from "@/hooks/use-media-query";
import SidebarComponent from "./sidebar/Sidebar";

const Sidebar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { userRole } = useAuth();
  
  return (
    <SidebarComponent 
      isOpen={!isMobile} 
      isMobile={isMobile} 
      onClose={() => {}} 
      userRole={userRole} 
    />
  );
};

export default Sidebar;
