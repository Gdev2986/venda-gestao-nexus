
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "../theme/theme-toggle";
import { AnimatePresence, motion } from "framer-motion";
import { useUserRole } from "@/hooks/use-user-role";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  // Use localStorage to persist sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const isMobile = useIsMobile();
  
  // Get user role from custom hook
  const { userRole } = useUserRole();

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebar-state", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - fixed positioning with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          className={`fixed left-0 top-0 z-40 h-screen ${
            isMobile ? 'w-64' : 'w-64'
          } bg-sidebar-background`}
          initial={{ x: sidebarOpen ? 0 : "-100%" }}
          animate={{ x: sidebarOpen ? 0 : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Sidebar 
            isOpen={sidebarOpen} 
            isMobile={isMobile} 
            onClose={() => setSidebarOpen(false)} 
            userRole={userRole}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Main content */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sticky top-0 bg-background z-10">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">SigmaPay</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <NotificationDropdown />
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      
      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
