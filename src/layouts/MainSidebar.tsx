
import { memo } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";
import SidebarNavigation from "@/components/layout/sidebar/SidebarNavigation";
import SidebarFooter from "@/components/layout/sidebar/SidebarFooter";
import SidebarUserProfile from "@/components/layout/sidebar/SidebarUserProfile";

interface MainSidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole: UserRole;
}

// Memoize the Sidebar component to prevent unnecessary re-renders
const MainSidebar = memo(({ isOpen, isMobile, onClose, userRole }: MainSidebarProps) => {
  return (
    <>
      {/* Mobile backdrop with animation */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar with fixed position and animation only for position */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 text-sidebar-foreground transition-transform duration-200 ease-in-out",
          isMobile ? "shadow-xl" : "border-r border-sidebar-border",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: 'hsl(196, 70%, 20%)' }}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-xs md:text-base">
              SP
            </div>
            <span className="text-base md:text-lg font-semibold text-white">SigmaPay</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent p-1"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2 md:py-4 px-2 md:px-3">
          <SidebarNavigation userRole={userRole} />
          <SidebarFooter />
        </div>

        <SidebarUserProfile userRole={userRole} />
      </div>
    </>
  );
});

MainSidebar.displayName = "MainSidebar";

export default MainSidebar;
