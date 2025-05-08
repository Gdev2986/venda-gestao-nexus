
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { getDashboardPath } from "@/routes/routeUtils";

const RootLayout = () => {
  const { user, isLoading } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  
  // Add a slight delay for loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500); // 0.5 second loading time
    
    return () => clearTimeout(timer);
  }, []);
  
  // Log para depuração
  useEffect(() => {
    console.log("RootLayout - isLoading:", isLoading, "isRoleLoading:", isRoleLoading, "user:", !!user);
    if (!isLoading && !isRoleLoading && user) {
      console.log("RootLayout - will redirect to:", getDashboardPath(userRole));
    }
  }, [isLoading, isRoleLoading, user, userRole]);
  
  // Se ainda estiver carregando ou mostrando animação de carregamento, mostre um spinner
  if (isLoading || isRoleLoading || showLoading) {
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
  
  // Se estiver autenticado, redirecione para o dashboard específico do papel
  if (user) {
    let dashboardPath;
    
    try {
      dashboardPath = getDashboardPath(userRole);
    } catch (error) {
      console.error("Erro ao obter caminho do dashboard:", error);
      dashboardPath = PATHS.LOGIN; // Fallback para login se houver erro
    }
    
    console.log(`User authenticated, redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }
  
  // Se não estiver autenticado, redirecione para login
  console.log("User not authenticated, redirecting to login");
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
