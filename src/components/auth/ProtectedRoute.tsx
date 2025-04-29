
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Simplificando para evitar o loop infinito
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  if (!user) {
    // Se não estiver autenticado, redirecione para a página inicial com informação do local atual
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderize os filhos (conteúdo protegido)
  return <>{children}</>;
};

export default ProtectedRoute;
