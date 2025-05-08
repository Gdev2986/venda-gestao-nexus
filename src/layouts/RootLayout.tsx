
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { getDashboardPath } from "@/routes/routeUtils";
import { UserRole } from "@/types";

const RootLayout = () => {
  const { user, isLoading, signOut } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  
  // Log para depuração
  useEffect(() => {
    console.log("RootLayout - isLoading:", isLoading, "isRoleLoading:", isRoleLoading, "user:", !!user);
    
    // Detectar possível loop infinito com token expirado
    const tokenExpired = !!user && (userRole === undefined || userRole === null);
    
    if (tokenExpired && !isLoading && !isRoleLoading) {
      console.log("Possível token expirado detectado, forçando logout");
      setErrorState(true);
      // Tentativa de corrigir o estado de autenticação
      signOut().catch(err => console.error("Erro ao fazer logout:", err));
    }
    
    if (!isLoading && !isRoleLoading && user && userRole) {
      console.log("RootLayout - userRole:", userRole);
      try {
        const dashPath = getDashboardPath(userRole);
        console.log("RootLayout - will redirect to:", dashPath);
      } catch (error) {
        console.error("Erro ao obter caminho do dashboard:", error);
      }
    }
  }, [isLoading, isRoleLoading, user, userRole, signOut]);
  
  // Add a slight delay for loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 500); // 0.5 second loading time
    
    return () => clearTimeout(timer);
  }, []);
  
  // Se ainda estiver carregando ou mostrando animação de carregamento, mostre um spinner
  if ((isLoading || isRoleLoading || showLoading) && !errorState) {
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
  
  // Se houver um estado de erro ou token expirado, redirecione para login
  if (errorState || (user && !userRole)) {
    console.log("Estado de erro ou token expirado detectado, redirecionando para login");
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // Se estiver autenticado, redirecione para o dashboard específico do papel
  if (user && userRole) {
    let dashboardPath = PATHS.LOGIN; // Fallback default para evitar loops
    
    try {
      dashboardPath = getDashboardPath(userRole);
    } catch (error) {
      console.error("Erro ao obter caminho do dashboard:", error);
    }
    
    console.log(`User authenticated, redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }
  
  // Se não estiver autenticado, redirecione para login
  console.log("User not authenticated, redirecting to login");
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
