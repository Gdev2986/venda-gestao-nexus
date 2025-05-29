
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types/enums";
import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";
import PartnerLayout from "./PartnerLayout";
import LogisticsLayout from "./LogisticsLayout";
import { Spinner } from "@/components/ui/spinner";

const MainLayout = () => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();

  // Se ainda está carregando
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Se não autenticado, redirecionar para login
  if (!isAuthenticated || !user) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // Se não tem role ainda, aguardar
  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Renderizar layout baseado no role do usuário
  switch (userRole) {
    case UserRole.ADMIN:
      return <AdminLayout />;
    case UserRole.CLIENT:
      return <UserLayout />;
    case UserRole.PARTNER:
      return <PartnerLayout />;
    case UserRole.LOGISTICS:
      return <LogisticsLayout />;
    case UserRole.FINANCIAL:
      return <UserLayout />;
    default:
      console.warn("Unknown user role:", userRole);
      return <Navigate to={PATHS.LOGIN} replace />;
  }
};

export default MainLayout;
