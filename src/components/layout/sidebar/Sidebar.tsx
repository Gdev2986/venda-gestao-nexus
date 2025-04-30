
import { memo } from "react";
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
  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      {/* Sidebar with animation */}
      <motion.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 text-sidebar-foreground",
          isMobile ? "shadow-xl" : "border-r border-sidebar-border"
        )}
        style={{ backgroundColor: 'hsl(196, 70%, 20%)' }}
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
              SP
            </div>
            <span className="text-lg font-semibold text-white">SigmaPay</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-sidebar-foreground hover:text-white hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <SidebarNavigation userRole={userRole} />
          <SidebarFooter />
        </div>

        <SidebarUserProfile userRole={userRole} />
      </motion.div>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
