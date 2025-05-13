
import React from 'react';
import { UserRole } from '@/types';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import SidebarUserProfile from './SidebarUserProfile';
import { SidebarProps } from './types';

const Sidebar = ({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <SidebarNavigation userRole={userRole} />
      </div>
      <SidebarFooter />
      <SidebarUserProfile userRole={userRole} />
    </div>
  );
};

export default Sidebar;
