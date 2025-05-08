
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { getDashboardPath } from "@/routes/routeUtils";

const RootLayout = () => {
  const { user, isLoading, signOut } = useAuth();
  const { userRole, isRoleLoading } = useUserRole();
  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);
  
  // Debug logging
  useEffect(() => {
    console.log("RootLayout - isLoading:", isLoading, "isRoleLoading:", isRoleLoading, "user:", !!user);
    
    // Detect possible infinite loop with expired token
    const tokenExpired = !!user && (userRole === undefined || userRole === null);
    
    if (tokenExpired && !isLoading && !isRoleLoading) {
      console.log("Possible expired token detected, forcing logout");
      setErrorState(true);
      // Attempt to fix authentication state
      signOut().catch(err => console.error("Error during logout:", err));
    }
    
    if (!isLoading && !isRoleLoading && user && userRole) {
      console.log("RootLayout - userRole:", userRole);
      try {
        const dashPath = getDashboardPath(userRole);
        console.log("RootLayout - will redirect to:", dashPath);
      } catch (error) {
        console.error("Error getting dashboard path:", error);
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
  
  // If still loading or showing loading animation, show a spinner
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
  
  // If there's an error state or expired token, redirect to login
  if (errorState || (user && !userRole)) {
    console.log("Error state or expired token detected, redirecting to login");
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // If authenticated, redirect to the role-specific dashboard
  if (user && userRole) {
    let dashboardPath = PATHS.LOGIN; // Fallback default to avoid loops
    
    try {
      dashboardPath = getDashboardPath(userRole);
    } catch (error) {
      console.error("Error getting dashboard path:", error);
    }
    
    console.log(`User authenticated, redirecting to ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }
  
  // If not authenticated, redirect to login
  console.log("User not authenticated, redirecting to login");
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
