
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
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
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

  // Determine redirect path when user and role are available
  useEffect(() => {
    // Only set redirect path when we have all necessary data
    if (!isLoading && isAuthenticated && user && userRole) {
      try {
        const dashboardPath = getDashboardPath(userRole);
        console.log(`User authenticated as ${userRole}, will redirect to ${dashboardPath}`);
        setRedirectPath(dashboardPath);
      } catch (error) {
        console.error("Error getting dashboard path:", error);
        setRedirectPath(PATHS.LOGIN);
      }
    } else if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated, will redirect to login");
      setRedirectPath(PATHS.LOGIN);
    }
  }, [isLoading, isAuthenticated, user, userRole]);
  
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
  
  // Only redirect when we have determined the path
  if (redirectPath) {
    if (redirectPath === PATHS.LOGIN && location.pathname !== PATHS.LOGIN) {
      console.log("Redirecting to login");
      return <Navigate to={PATHS.LOGIN} replace />;
    } else if (redirectPath !== PATHS.LOGIN && location.pathname === PATHS.LOGIN) {
      console.log("Redirecting to dashboard:", redirectPath);
      return <Navigate to={redirectPath} replace />;
    }
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
