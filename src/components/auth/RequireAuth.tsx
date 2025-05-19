
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

const RequireAuth = ({ allowedRoles = [], redirectTo = PATHS.LOGIN }: RequireAuthProps) => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [showLoading, setShowLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState(redirectTo);
  
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

  // Check authentication and permissions
  useEffect(() => {
    // Only proceed when loading is complete
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated || !user) {
        setShouldRedirect(true);
        setRedirectPath(PATHS.LOGIN);
        return;
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
            setRedirectPath(dashboardPath);
            setShouldRedirect(true);
          } catch (error) {
            console.error("Error getting dashboard path:", error);
            setRedirectPath(PATHS.LOGIN);
            setShouldRedirect(true);
          }
        }
      } else if (isAuthenticated && user) {
        // If authenticated but no role, fetch the role again
        // This should rarely happen if our AuthContext is working correctly
        console.log("User is authenticated but missing role, fetching role");
        // We'll let the AuthContext handle the role fetching
      }
    }
  }, [isLoading, isAuthenticated, user, userRole, allowedRoles, location.pathname, toast]);

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

  // Handle redirects
  if (shouldRedirect) {
    console.log("RequireAuth redirecting to:", redirectPath);
    
    // Store current path for post-login redirect if going to login
    if (redirectPath === PATHS.LOGIN) {
      sessionStorage.setItem("redirectPath", location.pathname);
    }
    
    // Use window.location.href for more reliable mobile redirects
    window.location.href = redirectPath;
    
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
