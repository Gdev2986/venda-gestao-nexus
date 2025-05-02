
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { LoadingAnimation } from "@/components/ui/loading-animation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    console.log("ProtectedRoute effect - isLoading:", isLoading, "user:", !!user);
    
    // Only determine redirect after loading is complete
    if (!isLoading && !user) {
      console.log("Setting shouldRedirect to true");
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  console.log("ProtectedRoute render - isLoading:", isLoading, "shouldRedirect:", shouldRedirect);

  // Se estiver carregando, mostre um spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <LoadingAnimation size="lg" color="bg-blue-900" />
        <p className="mt-6 text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }

  // Se não houver usuário autenticado e não estiver carregando, redirecione
  if (shouldRedirect) {
    console.log("Redirecting to / from", location.pathname);
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Se estiver autenticado, renderize o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
