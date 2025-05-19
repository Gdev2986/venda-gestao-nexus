
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDashboardPath } from "@/routes/routeUtils";

const RootLayout = () => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  
  // Add a slight delay for loading animation
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoading(false);
      }, 500);
      
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
  
  // Simple redirection logic
  if (isAuthenticated && userRole) {
    const dashboardPath = getDashboardPath(userRole);
    if (location.pathname === PATHS.LOGIN) {
      return <Navigate to={dashboardPath} replace />;
    }
  } else if (!isAuthenticated && location.pathname !== PATHS.LOGIN) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // Show loading if we're still deciding where to redirect
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Spinner size="lg" />
      <p className="mt-4 text-muted-foreground">Redirecionando...</p>
    </div>
  );
};

export default RootLayout;
