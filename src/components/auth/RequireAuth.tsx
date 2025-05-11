
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
import { refreshSession, cleanupAuthState } from "@/utils/auth-utils";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const RequireAuth = ({ allowedRoles = [], redirectTo = PATHS.LOGIN }: RequireAuthProps) => {
  const { user, isLoading, signOut } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  
  // Periodically refresh the session token
  useEffect(() => {
    if (user) {
      // Set up token refresh every 10 minutes
      const tokenRefreshInterval = setInterval(async () => {
        console.log("Refreshing auth token...");
        await refreshSession();
      }, 10 * 60 * 1000); // 10 minutes
      
      return () => clearInterval(tokenRefreshInterval);
    }
  }, [user]);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    console.log("RequireAuth effect - isLoading:", isLoading, "isRoleLoading:", isRoleLoading);
    console.log("Current location:", location.pathname);
    console.log("Current user role:", userRole);
    console.log("Allowed roles:", allowedRoles);
    
    // Check for possible expired token
    const tokenExpired = !!user && (userRole === undefined || userRole === null);
    
    if (tokenExpired && !isLoading && !isRoleLoading) {
      console.log("Possibly expired token detected, forcing logout");
      cleanupAuthState();
      signOut().catch(err => console.error("Error during logout:", err));
      return;
    }
    
    // Only determine redirect after loading is complete
    if (!isLoading && !isRoleLoading) {
      if (!user) {
        console.log("Setting shouldRedirect to true - no user");
        setShouldRedirect(true);
        return;
      }
      
      // Special rules for LOGISTICS users
      if (userRole === UserRole.LOGISTICS) {
        // If a LOGISTICS user is trying to access logistics routes, allow it
        if (location.pathname.startsWith('/logistics')) {
          console.log("LOGISTICS user accessing logistics routes:", location.pathname);
          return;
        }
      }
      
      // Special rules for FINANCIAL users
      if (userRole === UserRole.FINANCIAL) {
        // If a FINANCIAL user is trying to access financial routes, allow it
        if (location.pathname.startsWith('/financial')) {
          console.log("FINANCIAL user accessing financial routes:", location.pathname);
          return;
        }
        
        // Allow FINANCIAL users to access specific admin routes
        if (location.pathname.includes('/admin/payments') || 
            location.pathname.includes('/admin/clients') || 
            location.pathname.includes('/admin/reports')) {
          console.log("Financial user accessing permitted admin route:", location.pathname);
          return;
        }
      }
      
      // Check if user has permission to access this route
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`User role ${userRole} not allowed to access this route`);
        
        toast({
          title: "Acesso não autorizado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive",
        });
        
        // Set redirect path to specific dashboard
        try {
          const dashboardPath = getDashboardPath(userRole);
          
          // Check if we're already on the redirect path
          if (location.pathname !== dashboardPath) {
            console.log("Will redirect to dashboard path:", dashboardPath);
            setRedirectPath(dashboardPath);
            setUnauthorized(true);
          } else {
            console.log("Already on redirect path, not redirecting again");
          }
        } catch (error) {
          console.error("Error getting dashboard path:", error);
          setRedirectPath(PATHS.LOGIN);
          setUnauthorized(true);
        }
      }
    }
  }, [isLoading, isRoleLoading, user, userRole, allowedRoles, toast, location.pathname, signOut]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading && !isRoleLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
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

  // If token has expired, redirect to login
  const tokenExpired = !!user && (userRole === undefined || userRole === null);
  if (tokenExpired) {
    console.log("Token possibly expired, redirecting to login");
    return <Navigate to={PATHS.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // If not authenticated and not loading, redirect to login
  if (shouldRedirect || !user) {
    console.log("Redirecting to login from", location.pathname);
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={PATHS.LOGIN} state={{ from: location.pathname }} replace />;
  }

  // If unauthorized and we have a redirect path, and we're not already on that path
  if (unauthorized && redirectPath && location.pathname !== redirectPath) {
    console.log(`Redirecting unauthorized user with role ${userRole} to ${redirectPath}`);
    return <Navigate to={redirectPath} replace />;
  }

  // Special cases for specific user roles
  if (userRole === UserRole.FINANCIAL) {
    // Allow FINANCIAL users to access financial routes AND specific admin routes
    if (location.pathname.startsWith('/financial') || 
        location.pathname.includes('/admin/payments') ||
        location.pathname.includes('/admin/clients') ||
        location.pathname.includes('/admin/reports')) {
      return <Outlet />;
    }
  }
  
  if (userRole === UserRole.LOGISTICS) {
    // Allow LOGISTICS users to access logistics routes
    if (location.pathname.startsWith('/logistics')) {
      return <Outlet />;
    }
  }

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    try {
      const dashboardPath = getDashboardPath(userRole);
      console.log(`Redirecting user with role ${userRole} to ${dashboardPath}`);
      return <Navigate to={dashboardPath} replace />;
    } catch (error) {
      console.error("Error getting dashboard path:", error);
      return <Navigate to={PATHS.LOGIN} replace />;
    }
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
