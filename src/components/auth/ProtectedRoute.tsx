
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, userRole } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  
  // Use effect to prevent immediate redirects that can cause loops
  useEffect(() => {
    console.log("ProtectedRoute effect - isLoading:", isLoading, "user:", !!user, "userRole:", userRole);
    
    // Only determine redirect after loading is complete AND we have all necessary data
    if (!isLoading && (!user || !userRole)) {
      console.log("Setting shouldRedirect to true - missing user or role");
      setShouldRedirect(true);
    }
  }, [isLoading, user, userRole]);

  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  console.log("ProtectedRoute render - isLoading:", isLoading, "shouldRedirect:", shouldRedirect);

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

  // Se não houver usuário autenticado OU userRole não estiver disponível, redirecione
  if (shouldRedirect) {
    console.log("Redirecting to / from", location.pathname);
    // Store the current location using sessionStorage for better security
    sessionStorage.setItem("redirectPath", location.pathname);
    // Use window.location for mobile compatibility
    window.location.href = "/";
    // Return loading state while redirecting
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Redirecionando...</p>
      </div>
    );
  }

  // Se estiver autenticado E tivermos o userRole, renderize o conteúdo protegido
  return <>{children}</>;
};

export default ProtectedRoute;
