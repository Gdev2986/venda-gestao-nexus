
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PATHS } from "@/routes/paths";
import { LoadingAnimation } from "@/components/ui/loading-animation";

const RootLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // If still loading, show a spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <LoadingAnimation size="lg" color="bg-blue-900" />
        <p className="mt-6 text-muted-foreground">Carregando aplicação...</p>
      </div>
    );
  }
  
  // If authenticated, redirect to dashboard
  if (user) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }
  
  // If not authenticated, redirect to login
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
