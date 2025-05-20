
import * as React from "react";
import { useState, useEffect } from "react";
import { UserRole } from "@/types";
import Sidebar from "./sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "../theme/theme-toggle";
import { useUserRole } from "@/hooks/use-user-role";
import { AnimatePresence } from "framer-motion";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  // Use localStorage to persist sidebar state
  const [sidebarOpen, setSidebarOpen] = React.useState(() => {
    const saved = localStorage.getItem("sidebar-state");
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const isMobile = useIsMobile();
  
  // Get user role from custom hook
  const { userRole } = useUserRole();

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

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar component with AnimatePresence for smooth animation */}
      <AnimatePresence>
        <Sidebar 
          isOpen={sidebarOpen} 
          isMobile={isMobile} 
          onClose={() => setSidebarOpen(false)} 
          userRole={userRole}
        />
      </AnimatePresence>
      
      {/* Main content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out max-w-full ${
          sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
        }`}
      >
        {/* Header */}
        <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-2 sm:px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
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
        
        {/* Main scrollable content with improved padding for mobile */}
        <main className="flex-1 w-full overflow-y-auto overflow-x-hidden p-2 sm:p-4 md:p-6">
          <div className="mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
