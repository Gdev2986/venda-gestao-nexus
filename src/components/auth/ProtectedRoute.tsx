
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Verificar sessão do usuário apenas se não estiver em carregamento
    if (!isLoading && !user) {
      console.log("Não autenticado, redirecionando para login");
    }
  }, [user, isLoading]);

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
