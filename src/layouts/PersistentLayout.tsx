
import * as React from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserRole } from "@/hooks/use-user-role";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import MainSidebar from "./MainSidebar";

/**
 * PersistentLayout provides a consistent layout across all protected pages
 * with a sidebar that persists between route changes.
 */
const PersistentLayout = () => {
  // Use localStorage to persist sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const isMobile = useIsMobile();
  const { userRole } = useUserRole();
  const [isLoading, setIsLoading] = React.useState(true);

  // Close sidebar on mobile by default
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  React.useEffect(() => {
    if (!isMobile) { // Only save state for desktop
      localStorage.setItem("sidebar-state", JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isMobile]);

  // Add short loading animation for smoother transitions
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-foreground">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar component - mounted once and persists across routes */}
      <MainSidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile} 
        onClose={() => setSidebarOpen(false)} 
        userRole={userRole}
      />
      
      {/* Main content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        } max-w-full`}
      >
        {/* Header */}
        <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
              className="p-1"
            >
              <Menu className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <h1 className="text-base md:text-xl font-semibold truncate">SigmaPay</h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <ThemeToggle />
            <NotificationDropdown />
          </div>
        </header>
        
        {/* Main scrollable content - holds the current route's content */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default PersistentLayout;
