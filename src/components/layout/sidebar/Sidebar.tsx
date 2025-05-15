
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import SidebarUserProfile from "./SidebarUserProfile";
import { SidebarProps } from "./types";

// Memoize the Sidebar component to prevent unnecessary re-renders
const Sidebar = memo(({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
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
      
      {/* Sidebar with fixed position and animation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 text-sidebar-foreground transition-transform duration-200 ease-in-out h-full",
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
              onClick={handleCloseClick}
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

Sidebar.displayName = "Sidebar";

export default Sidebar;
