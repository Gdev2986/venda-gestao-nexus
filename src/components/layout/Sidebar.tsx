
import React from "react";
import SidebarComponent from "./sidebar/Sidebar";
import { NotificationsProvider } from "@/contexts/NotificationsContext";

const Sidebar: React.FC = () => {
  return (
    <NotificationsProvider>
      <SidebarComponent />
    </NotificationsProvider>
  );
};

export default Sidebar;
