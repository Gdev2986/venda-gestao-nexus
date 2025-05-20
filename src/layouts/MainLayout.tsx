
import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import MainSidebar from "./MainSidebar";
import { useState, useEffect, useMemo } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toaster";
import { UserRole } from "@/types";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

// SSR-safe check
const isBrowser = typeof window !== 'undefined';

const MainLayout = () => {
  const navigate = useNavigate();
  
  // Safe state initialization
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (!isBrowser) return true;
    try {
      const saved = localStorage.getItem("sidebar-state");
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      console.error("Error reading sidebar state from localStorage:", e);
      return true;
    }
  });
  
  // Using boolean fallbacks to prevent null reference issues
  let isMobile = false;
  let userRole = null;
  let user = null;
  
  try {
    // Safely access hooks with fallbacks
    const mobileCheck = isBrowser ? window.innerWidth < 768 : false;
    isMobile = mobileCheck;
    
    // Get user data with safe fallbacks
    const authData = useAuth();
    user = authData?.user || null;
    
    const roleData = useUserRole();
    userRole = roleData?.userRole || null;
  } catch (error) {
    console.error("Error initializing MainLayout:", error);
    // Redirect to login on critical error after a short delay
    if (isBrowser) {
      setTimeout(() => {
        navigate(PATHS.LOGIN);
      }, 100);
    }
  }
  
  // Default to ADMIN role if userRole is null but user is authenticated
  const safeUserRole = useMemo(() => {
    return userRole || (user ? UserRole.ADMIN : null);
  }, [userRole, user]);

  // Close sidebar on mobile by default
  useEffect(() => {
    if (!isBrowser) return;
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    if (!isBrowser) return;
    try {
      if (!isMobile) { // Only save state for desktop
        localStorage.setItem("sidebar-state", JSON.stringify(sidebarOpen));
      }
    } catch (e) {
      console.error("Error saving sidebar state to localStorage:", e);
    }
  }, [sidebarOpen, isMobile]);

  // Handle critical errors with an emergency fallback UI
  if (!isBrowser || !user) {
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
};

export default MainLayout;
