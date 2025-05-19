
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDashboardPath } from "@/routes/routeUtils";
import { useToast } from "@/hooks/use-toast";

const RootLayout = () => {
  const { user, session, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const { toast } = useToast();
  
  // Debug logging
  useEffect(() => {
    console.log("RootLayout render status:", {
      isLoading,
      isAuthenticated,
      userRole,
      hasSession: !!session,
      path: location.pathname,
      redirectAttempted,
      userAgent: navigator.userAgent,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    });
  }, [isLoading, isAuthenticated, userRole, session, location.pathname, redirectAttempted]);
  
  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500); // 0.5 second loading time
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);
  
  // If still loading, show a spinner
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
  
  // Prevent infinite redirect loop
  if (redirectAttempted) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // If authenticated, redirect to the role-specific dashboard
  if (isAuthenticated && user && session && userRole) {
    try {
      const dashboardPath = getDashboardPath(userRole);
      console.log(`User authenticated as ${userRole}, redirecting to ${dashboardPath}`);
      
      // For development purposes, show a toast with authentication info
      toast({
        title: "Autenticado com sucesso",
        description: `Usuário: ${user.email}, Função: ${userRole}`,
      });
      
      setRedirectAttempted(true);
      return <Navigate to={dashboardPath} replace />;
    } catch (error) {
      console.error("Error getting dashboard path:", error);
      
      // If we can't determine the dashboard path, redirect to login
      toast({
        title: "Erro de autenticação",
        description: "Não foi possível determinar seu painel. Por favor, entre novamente.",
        variant: "destructive",
      });
      
      setRedirectAttempted(true);
      return <Navigate to={PATHS.LOGIN} replace />;
    }
  }
  
  // If not authenticated, redirect to login
  console.log("User not authenticated, redirecting to login");
  setRedirectAttempted(true);
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
