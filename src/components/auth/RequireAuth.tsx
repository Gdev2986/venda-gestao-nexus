
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
  
  // Verificar se estamos na página de login para evitar loops de verificação
  const isAuthPage = location.pathname === PATHS.LOGIN || 
                    location.pathname === PATHS.REGISTER || 
                    location.pathname === PATHS.FORGOT_PASSWORD || 
                    location.pathname === PATHS.RESET_PASSWORD;
  
  // Périodique actualisation du token uniquement si nous ne sommes pas sur une page d'authentification
  useEffect(() => {
    if (user && !isAuthPage) {
      // Set up token refresh every 10 minutes
      const tokenRefreshInterval = setInterval(async () => {
        console.log("Refreshing auth token...");
        await refreshSession();
      }, 10 * 60 * 1000); // 10 minutes
      
      return () => clearInterval(tokenRefreshInterval);
    }
  }, [user, isAuthPage]);
  
  useEffect(() => {
    // Não executar verificações de role se estivermos em páginas de autenticação
    if (isAuthPage) {
      setShowLoading(false);
      return;
    }
    
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
    }
  }, [isLoading, isRoleLoading, user, userRole, signOut, location.pathname, isAuthPage, allowedRoles]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading && !isRoleLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, isRoleLoading]);

  // Se estamos em páginas de autenticação, apenas renderizar os filhos sem verificações
  if (isAuthPage) {
    return <Outlet />;
  }

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

  // Check if user has permission to access this route
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    console.log(`User role ${userRole} not allowed to access this route ${location.pathname}`);
    toast({
      title: "Acesso não autorizado",
      description: "Você não tem permissão para acessar esta página",
      variant: "destructive",
    });
    
    try {
      const dashboardPath = getDashboardPath(userRole);
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
