
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { getDashboardPath } from "@/routes/routeUtils";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Define route permissions globally
const routePermissions: Record<string, UserRole[]> = {
  '/admin': [UserRole.ADMIN],
  '/financial': [UserRole.ADMIN, UserRole.FINANCIAL],
  '/logistics': [UserRole.ADMIN, UserRole.LOGISTICS],
  '/partner': [UserRole.PARTNER],
  '/user': [UserRole.CLIENT],
};

const RequireAuth = ({ allowedRoles = [], redirectTo = PATHS.LOGIN }: RequireAuthProps) => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [showLoading, setShowLoading] = useState(true);
  
  // Debug information
  useEffect(() => {
    console.log("RequireAuth render status:", {
      isLoading,
      isAuthenticated,
      userRole,
      path: location.pathname,
      allowedRoles
    });
  }, [isLoading, isAuthenticated, userRole, location.pathname, allowedRoles]);

  // Add a loading delay for better UX
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // If still loading, show a spinner
  if (isLoading || showLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Carregando aplicação...</p>
        </motion.div>
      </div>
    );
  }

  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login from", location.pathname);
    // Store the current location for redirect after login
    sessionStorage.setItem("redirectPath", location.pathname);
    
    // Use window.location.href for more reliable mobile redirects
    window.location.href = PATHS.LOGIN;
    
    // Return a loading component while redirecting
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecionando para login...</p>
      </div>
    );
  }

  // If we have a userRole, check permissions
  if (userRole) {
    // Check if user has permission to access this route
    const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(userRole);

    // If no permission, redirect to appropriate dashboard
    if (!hasPermission) {
      console.log(`User with role ${userRole} not allowed to access ${location.pathname}`);
      
      toast({
        title: "Acesso não autorizado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      
      try {
        const dashboardPath = getDashboardPath(userRole);
        
        // Use window.location.href for more reliable mobile redirects
        window.location.href = dashboardPath;
        
        // Return a loading component while redirecting
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-background">
            <Spinner size="lg" />
            <p className="mt-4 text-muted-foreground">Redirecionando...</p>
          </div>
        );
      } catch (error) {
        console.error("Error getting dashboard path:", error);
        
        // Fallback to login page
        window.location.href = PATHS.LOGIN;
        
        // Return a loading component while redirecting
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-background">
            <Spinner size="lg" />
            <p className="mt-4 text-muted-foreground">Redirecionando...</p>
          </div>
        );
      }
    }
  } else {
    // If no role but authenticated, there's something wrong with the user data
    console.error("User is authenticated but has no role");
    toast({
      title: "Erro de autenticação",
      description: "Ocorreu um erro ao verificar suas permissões",
      variant: "destructive",
    });
    
    // Use window.location.href for more reliable mobile redirects
    window.location.href = PATHS.LOGIN;
    
    // Return a loading component while redirecting
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
