
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import MainSidebar from "./MainSidebar";

const MainLayout = () => {
  // Use localStorage to persist sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const isMobile = useIsMobile();
  const { userRole } = useUserRole();
  const { user } = useAuth();

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
        }`}
      >
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
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
        
        {/* Main scrollable content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
