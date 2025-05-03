
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";

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
  
  // If still loading or showing loading animation, show a spinner
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
  
  // Helper function to get the appropriate dashboard based on role
  const getRoleBasedDashboard = () => {
    switch (userRole) {
      case UserRole.ADMIN:
        return PATHS.ADMIN.DASHBOARD;
      case UserRole.CLIENT:
        return PATHS.USER.DASHBOARD;
      case UserRole.PARTNER:
        return PATHS.PARTNER.DASHBOARD;
      case UserRole.FINANCIAL:
        return PATHS.FINANCIAL.DASHBOARD;
      case UserRole.LOGISTICS:
        return PATHS.LOGISTICS.DASHBOARD;
      default:
        return PATHS.USER.DASHBOARD;
    }
  };
  
  // If authenticated, redirect to role-specific dashboard
  if (user) {
    return <Navigate to={getRoleBasedDashboard()} replace />;
  }
  
  // If not authenticated, redirect to login
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
