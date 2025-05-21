
import React from "react";
import SidebarComponent from "./sidebar/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { UserRole } from "@/types";

const Sidebar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return <SidebarComponent isOpen={!isMobile} isMobile={isMobile} onClose={() => {}} userRole={UserRole.ADMIN} />;
};

export default Sidebar;
