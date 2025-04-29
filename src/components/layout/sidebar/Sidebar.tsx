
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";
import SidebarUserProfile from "./SidebarUserProfile";
import { SidebarProps } from "./types";

const Sidebar = ({ isOpen, isMobile, onClose, userRole }: SidebarProps) => {
  // Don't render anything if sidebar is closed and on desktop
  if (!isOpen && !isMobile) {
    return null;
  }

  const sidebarVariants = {
    hidden: { x: -320, opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <motion.div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-sidebar text-sidebar-foreground",
        isMobile ? "shadow-xl" : "border-r border-sidebar-border"
      )}
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      style={{ 
        position: isMobile ? 'fixed' : 'fixed',
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white font-bold">
            SP
          </div>
          <span className="text-lg font-semibold">SigmaPay</span>
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
  );
};

export default Sidebar;
