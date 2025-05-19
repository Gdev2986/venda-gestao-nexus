
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { motion } from "framer-motion";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface RequireAuthProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const RequireAuth = ({ allowedRoles = [], redirectTo = PATHS.LOGIN }: RequireAuthProps) => {
  const { user, isLoading, isAuthenticated, userRole } = useAuth();
  const { toast } = useToast();
  
  // If still loading, show a spinner
  if (isLoading) {
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

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    // Save the intended path for post-login redirect
    sessionStorage.setItem("redirectPath", window.location.pathname);
    return <Navigate to={redirectTo} replace />;
  }
  
  // Check if user has permission to access this route
  const hasPermission = allowedRoles.length === 0 || (userRole && allowedRoles.includes(userRole));
  
  // If no permission, show error and redirect
  if (!hasPermission) {
    toast({
      title: "Acesso não autorizado",
      description: "Você não tem permissão para acessar esta página",
      variant: "destructive",
    });
    
    // Redirect to login
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  // If authenticated and has permission, render the protected content
  return <Outlet />;
};

export default RequireAuth;
