
import React from "react";
import { UserRole } from "@/types";
import Sidebar from "@/components/layout/sidebar/Sidebar";

interface AdminSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, isMobile, onClose }) => {
  return (
    <Sidebar
      isOpen={isOpen}
      isMobile={isMobile}
      onClose={onClose}
      userRole={UserRole.ADMIN}
    />
  );
};

export default AdminSidebar;
