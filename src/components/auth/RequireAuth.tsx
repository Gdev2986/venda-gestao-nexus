import { Outlet } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { Spinner } from "@/components/ui/spinner";
import { UserRole } from "@/types";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  requiredRole?: UserRole;
}

const RequireAuth = ({ allowedRoles, requiredRole }: RequireAuthProps) => {
  const { isValidating, hasAccess } = useAuthGuard({
    allowedRoles,
    requiredRole
  });

  // Mostrar spinner enquanto valida autenticação e permissões
  if (isValidating) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Verificando permissões...</p>
      </div>
    );
  }

  // Se chegou até aqui e hasAccess é true, renderiza o conteúdo protegido
  // O hook useAuthGuard já fez todos os redirecionamentos necessários
  if (hasAccess) {
    return <Outlet />;
  }

  // Se não tem acesso e não está validando, não renderiza nada
  // (o redirecionamento já foi feito pelo hook)
  return null;
};

export default RequireAuth;
