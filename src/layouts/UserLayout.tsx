
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainSidebar from "./MainSidebar";
import { useUserRole } from "@/hooks/use-user-role";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { Spinner } from "@/components/ui/spinner";

const UserLayout = () => {
  // Use localStorage to persist sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const isMobile = useIsMobile();
  const { userRole } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (!isMobile) { // Only save state for desktop
      localStorage.setItem("sidebar-state", JSON.stringify(sidebarOpen));
    }
  }, [sidebarOpen, isMobile]);

  // Add loading animation
  useEffect(() => {
    // Simulate loading for smoother transitions
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // 0.3 second loading time - reduced for better mobile experience
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-full" style={{ backgroundColor: 'hsl(196, 70%, 20%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" className="border-white border-t-transparent" />
          <p className="mt-4 text-white">Carregando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar component - mounted always but conditionally shown */}
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
        <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-2 sm:px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
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
        
        {/* Main scrollable content - improved mobile experience */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6 lg:p-8">
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

export default UserLayout;
