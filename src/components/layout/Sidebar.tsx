
import SidebarNavigation from './sidebar/SidebarNavigation';
import SidebarFooter from './sidebar/SidebarFooter';
import SidebarUserProfile from './sidebar/SidebarUserProfile';
import { SidebarProps } from './sidebar/types';

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
