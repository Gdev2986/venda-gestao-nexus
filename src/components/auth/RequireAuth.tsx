
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
  const { user, session, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [showLoading, setShowLoading] = useState(true);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Add a loading delay for better UX
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Debug information
  useEffect(() => {
    console.log("RequireAuth render status:", {
      isLoading,
      isAuthenticated,
      userRole,
      path: location.pathname,
      allowedRoles,
      hasSession: !!session,
      isMobile,
      userAgent: navigator.userAgent
    });
  }, [isLoading, isAuthenticated, userRole, location.pathname, allowedRoles, session, isMobile]);

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

  // If not authenticated or no session exists, redirect to login
  if (!isAuthenticated || !session || !user) {
    console.log("User not authenticated or no session, redirecting to login from", location.pathname);
    // Store the current location for redirect after login
    sessionStorage.setItem("redirectPath", location.pathname);
    
    if (isMobile) {
      console.log("Mobile device detected, using window.location for redirect");
      // For mobile devices, use window.location for more reliable redirect
      window.location.href = PATHS.LOGIN;
      // Return empty div while redirecting
      return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
    } else {
      return <Navigate to={PATHS.LOGIN} state={{ from: location.pathname }} replace />;
    }
  }

  // If we have a session but no userRole yet, show loading
  if (isAuthenticated && !userRole) {
    console.log("User is authenticated but role is not yet loaded");
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Verificando permissões...</p>
        </motion.div>
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
        
        if (isMobile) {
          console.log("Mobile device detected, using window.location for redirect");
          window.location.href = dashboardPath;
          return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
        } else {
          return <Navigate to={dashboardPath} replace />;
        }
      } catch (error) {
        console.error("Error getting dashboard path:", error);
        return <Navigate to={PATHS.LOGIN} replace />;
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
    
    if (isMobile) {
      window.location.href = PATHS.LOGIN;
      return <div className="flex items-center justify-center h-screen"><Spinner size="lg" /></div>;
    } else {
      return <Navigate to={PATHS.LOGIN} replace />;
    }
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
