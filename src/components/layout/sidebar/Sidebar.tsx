
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types";

import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import SidebarUserProfile from "./SidebarUserProfile";
import { useBreakpoint } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
  userRole: UserRole;
}

// Memoize the Sidebar component to prevent unnecessary re-renders
const Sidebar = memo(({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
  const breakpoint = useBreakpoint();
  const isSmallScreen = ['xs', 'sm', 'md'].includes(breakpoint);
  
  // Optimize button animation by memoizing the click handler
  const handleCloseClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {/* Mobile backdrop with animation */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleCloseClick}
        />
      )}
      
      {/* Sidebar with fixed position and animation only for position */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col text-sidebar-foreground transition-transform duration-200 ease-in-out",
          isSmallScreen ? "w-56 sm:w-60 shadow-xl" : "w-64 border-r border-sidebar-border",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: 'hsl(196, 70%, 20%)' }}
      >
        <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold text-sm sm:text-base">
              SP
            </div>
            <span className="text-base sm:text-lg font-semibold text-white">SigmaPay</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseClick}
              className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent h-8 w-8"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3">
          <SidebarNavigation userRole={userRole} />
          <SidebarFooter />
        </div>

        <SidebarUserProfile userRole={userRole} />
      </div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
