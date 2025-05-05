
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";
import { useToast } from "@/hooks/use-toast";

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
    console.log("RequireAuth effect - isLoading:", isLoading, "user:", !!user);
    
    // Only determine redirect after loading is complete
    if (!isLoading && !isRoleLoading) {
      if (!user) {
        console.log("Setting shouldRedirect to true - no user");
        setShouldRedirect(true);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // If role-specific access control is defined and user doesn't have permission
        console.log(`User role ${userRole} not allowed to access this route`);
        
        // Show unauthorized toast message
        toast({
          title: "Acesso não autorizado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive",
        });
        
        // Redirect to role-specific dashboard
        setTimeout(() => {
          // Redirect to role-specific dashboard
          switch(userRole) {
            case UserRole.ADMIN:
              window.location.href = PATHS.ADMIN.DASHBOARD;
              break;
            case UserRole.CLIENT:
              window.location.href = PATHS.USER.DASHBOARD;
              break;
            case UserRole.PARTNER:
              window.location.href = PATHS.PARTNER.DASHBOARD;
              break;
            case UserRole.FINANCIAL:
              window.location.href = PATHS.FINANCIAL.DASHBOARD;
              break;
            case UserRole.LOGISTICS:
              window.location.href = PATHS.LOGISTICS.DASHBOARD;
              break;
            default:
              window.location.href = PATHS.USER.DASHBOARD;
          }
        }, 0);
      }
    }
  }, [isLoading, isRoleLoading, user, userRole, allowedRoles, toast]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading && !isRoleLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isRoleLoading]);

  console.log("RequireAuth render - isLoading:", isLoading, "shouldRedirect:", shouldRedirect);

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
    console.log("Redirecting to login from", location.pathname);
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={PATHS.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Get the appropriate dashboard based on user role
    let roleDashboard;
    switch(userRole) {
      case UserRole.ADMIN:
        roleDashboard = PATHS.ADMIN.DASHBOARD;
        break;
      case UserRole.CLIENT:
        roleDashboard = PATHS.USER.DASHBOARD;
        break;
      case UserRole.PARTNER:
        roleDashboard = PATHS.PARTNER.DASHBOARD;
        break;
      case UserRole.FINANCIAL:
        roleDashboard = PATHS.FINANCIAL.DASHBOARD;
        break;
      case UserRole.LOGISTICS:
        roleDashboard = PATHS.LOGISTICS.DASHBOARD;
        break;
      default:
        roleDashboard = PATHS.USER.DASHBOARD;
    }
    
    console.log(`Redirecting user with role ${userRole} to ${roleDashboard}`);
    return <Navigate to={roleDashboard} replace />;
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
