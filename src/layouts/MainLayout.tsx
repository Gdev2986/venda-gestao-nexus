
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/hooks/use-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import Sidebar from "@/components/layout/sidebar/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  const { isOpen: sidebarOpen, toggle: toggleSidebar } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        isMobile={isMobile} 
        onClose={() => toggleSidebar()} 
        userRole={undefined} 
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        sidebarOpen && !isMobile ? 'ml-64' : 'ml-0'
      } max-w-full`}>
        {/* Header */}
        <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleSidebar}
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
              className="p-1"
            >
              <Menu className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Admin Panel</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            <NotificationDropdown />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Toast notifications */}
      <Toaster />
    </div>
  );
};

export default MainLayout;
