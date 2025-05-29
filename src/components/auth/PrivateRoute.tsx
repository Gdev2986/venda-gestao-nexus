
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types/enums";
import { useToast } from "@/hooks/use-toast";
import { getDashboardPath } from "@/utils/auth-utils";
import { motion } from "framer-motion";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  redirectTo = PATHS.LOGIN 
}) => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  // Debug log
  React.useEffect(() => {
    console.log("PrivateRoute render status:", {
      isLoading,
      isAuthenticated,
      userRole,
      path: location.pathname,
      allowedRoles
    });
  }, [isLoading, isAuthenticated, userRole, location.pathname, allowedRoles]);

  // Se ainda está carregando
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
        </motion.div>
      </div>
    );
  }

  // Se não autenticado
  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login from", location.pathname);
    // Armazenar caminho atual para redirecionamento após login
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Se tem role definido, verificar permissões
  if (userRole) {
    const hasPermission = allowedRoles.length === 0 || allowedRoles.includes(userRole as UserRole);

    if (!hasPermission) {
      console.log(`User with role ${userRole} not allowed to access ${location.pathname}`);
      
      toast({
        title: "Acesso não autorizado",
        description: "Você não tem permissão para acessar esta página",
        variant: "destructive",
      });
      
      try {
        const dashboardPath = getDashboardPath(userRole as any);
        return <Navigate to={dashboardPath} replace />;
      } catch (error) {
        console.error("Error getting dashboard path:", error);
        return <Navigate to={PATHS.LOGIN} replace />;
      }
    }
  } else {
    // Se não tem role mas está autenticado, há algo errado
    console.error("User is authenticated but has no role");
    toast({
      title: "Erro de autenticação",
      description: "Ocorreu um erro ao verificar suas permissões",
      variant: "destructive",
    });
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Se chegou até aqui, pode renderizar o conteúdo
  return <>{children}</>;
};

export default PrivateRoute;
