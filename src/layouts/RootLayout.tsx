
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getDashboardPath } from "@/routes/routeUtils";

const RootLayout = () => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  
  // Debug logging
  useEffect(() => {
    console.log("RootLayout render status:", {
      isLoading,
      isAuthenticated,
      userRole,
      path: location.pathname
    });
  }, [isLoading, isAuthenticated, userRole, location.pathname]);
  
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
  
  // If authenticated and we have a role, redirect to role-specific dashboard
  if (isAuthenticated && user && userRole) {
    try {
      const dashboardPath = getDashboardPath(userRole);
      console.log(`User authenticated as ${userRole}, redirecting to ${dashboardPath}`);
      return <Navigate to={dashboardPath} replace />;
    } catch (error) {
      console.error("Error getting dashboard path:", error);
      return <Navigate to={PATHS.LOGIN} replace />;
    }
  }
  
  // If not authenticated or no role, redirect to login
  console.log("User not authenticated or missing role, redirecting to login");
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
