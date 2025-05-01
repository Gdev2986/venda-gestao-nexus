
import { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import AdminSidebar from "./AdminSidebar";
import { useToast } from "@/hooks/use-toast";

const AdminLayout = () => {
  const { userRole, isRoleLoading } = useUserRole();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

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

  // Access control - only ADMIN and FINANCIAL roles can access the admin area
  const allowedRoles = [UserRole.ADMIN, UserRole.FINANCIAL];
  if (!allowedRoles.includes(userRole)) {
    toast({
      title: "Acesso negado",
      description: "Você não tem permissão para acessar esta área.",
      variant: "destructive"
    });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-background">
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        isMobile={isMobileScreen}
        onClose={() => setIsSidebarOpen(false)} 
        userRole={userRole}
      />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with toggle button */}
        <header className="flex items-center h-16 px-6 border-b bg-background">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <h1 className="ml-4 text-xl font-semibold">
            Painel Administrativo
          </h1>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
