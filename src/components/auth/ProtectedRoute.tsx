
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    // Only determine redirect after loading is complete
    if (!isLoading && !user) {
      setShouldRedirect(true);
    }
  }, [isLoading, user]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Se estiver carregando ou mostrando animação, mostre um spinner
  if (isLoading || showLoading) {
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

  // Se não houver usuário autenticado e não estiver carregando, redirecione
  if (shouldRedirect) {
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  // Se estiver autenticado, renderize o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
