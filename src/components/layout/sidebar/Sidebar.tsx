
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarNavigation from "./SidebarNavigation";
import SidebarUserProfile from "./SidebarUserProfile";
import SidebarFooter from "./SidebarFooter";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { user } = useAuth();
  const { userRole } = useUserRole();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile sidebar toggle button - only visible on mobile */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar backdrop - only on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex h-full w-72 flex-col border-r bg-card px-3 pb-3 pt-5 transition-transform duration-300 md:relative md:z-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0", // Always show on md screens
          className
        )}
      >
        <div className="flex items-center justify-between px-4">
          <span className="text-xl font-semibold">
            {userRole === UserRole.ADMIN && "Admin Panel"}
            {userRole === UserRole.FINANCIAL && "Financeiro"}
            {userRole === UserRole.LOGISTICS && "Logística"}
            {userRole === UserRole.PARTNER && "Dashboard Parceiro"}
            {userRole === UserRole.CLIENT && "Portal do Cliente"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-5 flex flex-col justify-between overflow-y-auto px-1">
          {/* Sidebar main content */}
          <div className="space-y-4">
            {user && userRole && (
              <SidebarNavigation userRole={userRole} />
            )}
          </div>
        </div>

        {/* User Profile and Logout at bottom */}
        <div className="mt-auto pt-4">
          <SidebarUserProfile userRole={userRole} />
          <SidebarFooter />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
