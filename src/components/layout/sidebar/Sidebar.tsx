
import { memo, useCallback, useEffect, useMemo } from "react";
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

  // Garantir que o sidebar seja renderizado mesmo quando fechado (para animações)
  useEffect(() => {
    // Prevenção de scroll na página quando o sidebar mobile estiver aberto
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, isOpen]);

  // Memoize navigation components to prevent re-renders
  const navigationComponent = useMemo(() => <SidebarNavigation userRole={userRole} />, [userRole]);
  const footerComponent = useMemo(() => <SidebarFooter />, []);
  const userProfileComponent = useMemo(() => <SidebarUserProfile userRole={userRole} />, [userRole]);

  return (
    <>
      {/* Mobile backdrop with animation */}
      {isMobile && isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleCloseClick}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar with fixed position and animation */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] md:w-64 text-sidebar-foreground h-full",
          "bg-sidebar",
          isMobile ? "shadow-xl" : "border-r border-sidebar-border"
        )}
        initial={{ x: isMobile ? -320 : isOpen ? 0 : -280 }}
        animate={{ x: isOpen ? 0 : (isMobile ? -320 : -280) }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between h-14 md:h-16 px-4 border-b border-white/20">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md bg-white/20 flex items-center justify-center text-white font-bold text-xs md:text-base">
              SP
            </div>
            <span className="text-base md:text-lg font-semibold text-white">SigmaPay</span>
          </div>

          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseClick}
              className="text-white hover:text-white hover:bg-white/20 p-1"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-2 md:py-4 px-2 md:px-3">
          {navigationComponent}
          {footerComponent}
        </div>

        {userProfileComponent}
      </motion.aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
