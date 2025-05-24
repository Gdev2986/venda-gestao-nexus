import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
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

  // Se ainda estiver carregando, mostra o spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Se não tiver role, redireciona para o login
  if (!userRole) {
    toast({
      title: "Erro de autenticação",
      description: "Ocorreu um erro ao verificar suas permissões",
      variant: "destructive",
    });
    return <Navigate to={redirectTo} replace />;
  }

  // Se tiver roles permitidas, verifica se o usuário tem permissão
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    toast({
      title: "Acesso não autorizado",
      description: "Você não tem permissão para acessar esta página",
      variant: "destructive",
    });
    
    const dashboardPath = getDashboardPath(userRole);
    return <Navigate to={dashboardPath} replace />;
  }

  // Se passou por todas as verificações, renderiza o conteúdo
  return <Outlet />;
};

export default RequireAuth;
