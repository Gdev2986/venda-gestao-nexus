
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";
import { useToast } from "@/hooks/use-toast";
import { getDashboardPath } from "@/routes/routeUtils";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const RequireAuth = ({ allowedRoles = [], redirectTo = PATHS.LOGIN }: RequireAuthProps) => {
  const { user, isLoading } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    // Only determine redirect after loading is complete
    if (!isLoading && !isRoleLoading && !user) {
      setShouldRedirect(true);
    }
  }, [isLoading, isRoleLoading, user]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading && !isRoleLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isRoleLoading]);

  // If still loading or showing loading animation, show a spinner
  if (isLoading || isRoleLoading || showLoading) {
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
  if (shouldRedirect || !user) {
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={PATHS.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && userRole) {
    let hasPermission = false;
    
    // Check if userRole is included in allowedRoles
    for (const role of allowedRoles) {
      if (userRole === role) {
        hasPermission = true;
        break;
      }
    }
    
    if (!hasPermission) {
      toast({
        title: "Acesso não autorizado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      
      try {
        const dashboardPath = getDashboardPath(userRole);
        return <Navigate to={dashboardPath} replace />;
      } catch (error) {
        return <Navigate to={PATHS.LOGIN} replace />;
      }
    }
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
