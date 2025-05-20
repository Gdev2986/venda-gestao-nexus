
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import MainSidebar from "./MainSidebar";
import { useState, useEffect, useMemo } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { useSafeIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { UserRole } from "@/types";

const MainLayout = () => {
  // Wrap the entire component in try/catch to prevent critical rendering failures
  try {
    // Use localStorage to persist sidebar state with error handling
    const [sidebarOpen, setSidebarOpen] = useState(() => {
      try {
        const saved = localStorage.getItem("sidebar-state");
        return saved !== null ? JSON.parse(saved) : true;
      } catch (e) {
        console.error("Error reading sidebar state from localStorage:", e);
        return true;
      }
    });
    
    // Use our safer version of the hook
    const isMobile = useSafeIsMobile();
    const { userRole } = useUserRole();
    const { user } = useAuth();
    
    // Default to ADMIN role if userRole is null but user is authenticated
    const safeUserRole = useMemo(() => {
      return userRole || (user ? UserRole.ADMIN : null);
    }, [userRole, user]);

    // Close sidebar on mobile by default
    useEffect(() => {
      if (isMobile) {
        setSidebarOpen(false);
      }
    }, [isMobile]);

    // Save sidebar state to localStorage when it changes
    useEffect(() => {
      try {
        if (!isMobile) { // Only save state for desktop
          localStorage.setItem("sidebar-state", JSON.stringify(sidebarOpen));
        }
      } catch (e) {
        console.error("Error saving sidebar state to localStorage:", e);
      }
    }, [sidebarOpen, isMobile]);

    // If no user or role, don't render sidebar
    if (!user) {
      return (
        <div className="flex-1 flex flex-col">
          <main className="flex-1 w-full overflow-y-auto">
            <Outlet />
            <Toaster />
          </main>
        </div>
      );
    }

    return (
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar component - mounted always but conditionally shown */}
        {safeUserRole && (
          <MainSidebar 
            isOpen={sidebarOpen} 
            isMobile={isMobile} 
            onClose={() => setSidebarOpen(false)} 
            userRole={safeUserRole}
          />
        )}
        
        {/* Main content */}
        <div 
          className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
            sidebarOpen && !isMobile && safeUserRole ? 'ml-64' : 'ml-0'
          } max-w-full`}
        >
          {/* Header */}
          <header className="h-14 md:h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
            <div className="flex items-center space-x-2 md:space-x-4">
              {safeUserRole && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  aria-label={sidebarOpen ? "Fechar menu" : "Abrir menu"}
                  className="p-1"
                >
                  <Menu className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              )}
              <h1 className="text-base md:text-xl font-semibold truncate">SigmaPay</h1>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <ThemeToggle />
              <NotificationDropdown />
            </div>
          </header>
          
          {/* Main scrollable content - updated for mobile spacing */}
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
  } catch (error) {
    console.error("Critical error in MainLayout:", error);
    // Emergency fallback UI
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
        <h2 className="text-xl font-semibold mb-2">Erro ao carregar layout</h2>
        <p className="text-muted-foreground mb-4">Ocorreu um erro inesperado ao carregar a aplicação.</p>
        <Button onClick={() => window.location.href = "/login"}>
          Voltar para login
        </Button>
        <Outlet />
        <Toaster />
      </div>
    );
  }
};

export default MainLayout;
