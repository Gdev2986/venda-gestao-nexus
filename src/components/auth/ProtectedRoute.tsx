
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Se estiver carregando, mostre um spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  // Se não houver usuário autenticado, redirecione para a página inicial
  if (!user) {
    // Armazena a localização atual para redirecionamento após login
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Se estiver autenticado, renderize o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
