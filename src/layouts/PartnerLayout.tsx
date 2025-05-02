
import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import PartnerSidebar from "./PartnerSidebar";
import { useToast } from "@/hooks/use-toast";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "@/components/layout/NotificationDropdown";
import ThemeToggle from "@/components/theme/theme-toggle";
import { Toaster } from "@/components/ui/toaster";

const PartnerLayout = () => {
  const { userRole, isRoleLoading } = useUserRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const { toast } = useToast();

  // Check screen size for responsive design
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileScreen(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Loading state
  if (isRoleLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Access control - only PARTNER role can access the partner area
  if (userRole !== UserRole.PARTNER) {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive"
    });
    
    // Redirect based on role
    if (userRole === UserRole.ADMIN || userRole === UserRole.FINANCIAL) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (userRole === UserRole.CLIENT) {
      return <Navigate to="/user/dashboard" replace />;
    } else if (userRole === UserRole.LOGISTICS) {
      return <Navigate to="/logistics/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <PartnerSidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobileScreen}
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen && !isMobileScreen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-background sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Fechar menu" : "Abrir menu"}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Área do Parceiro</h1>
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

export default PartnerLayout;
