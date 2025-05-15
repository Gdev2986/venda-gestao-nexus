
import React from "react";
import SidebarComponent from "./sidebar/Sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

const Sidebar: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  return <SidebarComponent isOpen={!isMobile} isMobile={isMobile} onClose={() => {}} userRole="ADMIN" />;
};

export default Sidebar;
