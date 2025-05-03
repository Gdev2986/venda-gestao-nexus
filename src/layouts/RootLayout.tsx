
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Spinner } from "@/components/ui/spinner";
import { PATHS } from "@/routes/paths";

const RootLayout = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  // If still loading, show a spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Loading application...</p>
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
