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
  const { user, isLoading, signOut } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const { toast } = useToast();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    console.log("RequireAuth effect - isLoading:", isLoading, "isRoleLoading:", isRoleLoading, "user:", !!user);
    console.log("Current location:", location.pathname);
    console.log("Current user role:", userRole);
    console.log("Allowed roles:", allowedRoles);
    
    // Verificar se há um possível token expirado
    const tokenExpired = !!user && (userRole === undefined || userRole === null);
    
    if (tokenExpired && !isLoading && !isRoleLoading) {
      console.log("Possível token expirado detectado, forçando logout");
      // Tentativa de corrigir o estado de autenticação
      signOut().catch(err => console.error("Erro ao fazer logout:", err));
      return;
    }
    
    // Only determine redirect after loading is complete
    if (!isLoading && !isRoleLoading) {
      if (!user) {
        console.log("Setting shouldRedirect to true - no user");
        setShouldRedirect(true);
        return;
      }
      
      // Special check for LOGISTICS users accessing admin routes
      if (userRole === UserRole.LOGISTICS) {
        console.log("LOGISTICS user detected, checking route access");
        
        // Give LOGISTICS users access to their own dashboard and admin routes
        if (location.pathname.startsWith('/logistics') || location.pathname.startsWith('/admin')) {
          console.log("LOGISTICS user accessing permitted route:", location.pathname);
          return;
        }
      }
      
      // Verificações especiais para certos papéis e rotas
      if (userRole === UserRole.FINANCIAL && 
          (location.pathname.includes('/admin/payments') || 
           location.pathname.includes('/admin/clients') || 
           location.pathname.includes('/admin/reports'))) {
        // Permitir que usuários financeiros acessem essas rotas específicas de admin
        console.log("Financial user accessing permitted admin route:", location.pathname);
        return;
      } 
      
      // Se o usuário estiver tentando acessar o dashboard do seu papel específico, permitir
      if (
        (userRole === UserRole.ADMIN && location.pathname.startsWith('/admin')) ||
        (userRole === UserRole.CLIENT && location.pathname.startsWith('/user')) ||
        (userRole === UserRole.PARTNER && location.pathname.startsWith('/partner')) || 
        (userRole === UserRole.FINANCIAL && location.pathname.startsWith('/financial')) ||
        (userRole === UserRole.LOGISTICS && location.pathname.startsWith('/logistics'))
      ) {
        console.log("User accessing their own routes:", location.pathname);
        return;
      }
      
      // Verificação de papéis permitidos
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        console.log(`User role ${userRole} not allowed to access this route`);
        
        toast({
          title: "Acesso não autorizado",
          description: "Você não tem permissão para acessar esta página",
          variant: "destructive",
        });
        
        // Definir caminho de redirecionamento para dashboard específico do papel
        try {
          const dashboardPath = getDashboardPath(userRole);
          
          // Verificar se já estamos no caminho de redirecionamento
          if (location.pathname !== dashboardPath) {
            console.log("Will redirect to dashboard path:", dashboardPath);
            setRedirectPath(dashboardPath);
            setUnauthorized(true);
          } else {
            // Se já estivermos no caminho de redirecionamento, não redirecionamos novamente
            console.log("Already on redirect path, not redirecting again");
          }
        } catch (error) {
          console.error("Erro ao obter caminho do dashboard:", error);
          // Redirecionar para login em caso de erro
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

  console.log("RequireAuth render - isLoading:", isLoading, "shouldRedirect:", shouldRedirect, "unauthorized:", unauthorized);

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

  // Se o token estiver expirado, redirecionar para login
  const tokenExpired = !!user && (userRole === undefined || userRole === null);
  if (tokenExpired) {
    console.log("Token possivelmente expirado, redirecionando para login");
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

  // Special check for LOGISTICS users accessing admin routes
  if (userRole === UserRole.LOGISTICS) {
    // Allow LOGISTICS users to access all admin routes AND their own routes
    if (location.pathname.startsWith('/logistics') || location.pathname.startsWith('/admin')) {
      return <Outlet />;
    }
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
    try {
      const dashboardPath = getDashboardPath(userRole);
      console.log(`Redirecting user with role ${userRole} to ${dashboardPath}`);
      return <Navigate to={dashboardPath} replace />;
    } catch (error) {
      console.error("Erro ao obter caminho do dashboard:", error);
      return <Navigate to={PATHS.LOGIN} replace />;
    }
  }

  // If authenticated and has the right role, render the protected content
  return <Outlet />;
};

export default RequireAuth;
