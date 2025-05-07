
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
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
    console.log("RequireAuth effect - isLoading:", isLoading, "user:", !!user);
    
    // Only determine redirect after loading is complete
    if (!isLoading && !isRoleLoading) {
      if (!user) {
        console.log("Setting shouldRedirect to true - no user");
        setShouldRedirect(true);
      } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        // Special cases for role access:
        // Financial users can access admin routes for payments, clients and reports
        if (userRole === UserRole.FINANCIAL && 
            (location.pathname.includes('/admin/payments') || 
             location.pathname.includes('/admin/clients') || 
             location.pathname.includes('/admin/reports'))) {
          // Allow financial users to access these specific admin routes
          console.log("Financial user accessing permitted admin route:", location.pathname);
        } 
        // If the user is trying to access their role's dashboard or direct routes, allow it
        else if (
          (userRole === UserRole.ADMIN && location.pathname.startsWith('/admin')) ||
          (userRole === UserRole.CLIENT && location.pathname.startsWith('/user')) ||
          (userRole === UserRole.PARTNER && location.pathname.startsWith('/partner')) || 
          (userRole === UserRole.FINANCIAL && location.pathname.startsWith('/financial')) ||
          (userRole === UserRole.LOGISTICS && location.pathname.startsWith('/logistics'))
        ) {
          console.log("User accessing their own routes:", location.pathname);
        }
        else {
          // If role-specific access control is defined and user doesn't have permission
          console.log(`User role ${userRole} not allowed to access this route`);
          
          // Show unauthorized toast message
          toast({
            title: "Acesso não autorizado",
            description: "Você não tem permissão para acessar esta página",
            variant: "destructive",
          });
          
          // Redirect to role-specific dashboard
          const dashboardPath = getDashboardPath(userRole);
          window.location.href = dashboardPath;
        }
      }
    }
  }, [isLoading, isRoleLoading, user, userRole, allowedRoles, toast, location.pathname]);

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

  // Special check for Financial users accessing admin routes
  if (userRole === UserRole.FINANCIAL && 
      (location.pathname.includes('/admin/payments') || 
       location.pathname.includes('/admin/clients') || 
       location.pathname.includes('/admin/reports'))) {
    // Allow financial users to access these specific admin routes
    return <Outlet />;
  }

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    console.log(`Redirecting user with role ${userRole} to ${getDashboardPath(userRole)}`);
    return <Navigate to={getDashboardPath(userRole)} replace />;
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
