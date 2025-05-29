
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PATHS } from "@/routes/paths";
import { getDashboardPath } from "@/utils/auth-utils";

const RootLayout = () => {
  const { user, isLoading, isAuthenticated, userRole, needsPasswordChange } = useAuth();
  const location = useLocation();
  
  console.log("RootLayout render status:", {
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    path: location.pathname,
    user: user?.id
  });
  
  // If still loading auth or user data, show spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to={PATHS.LOGIN} replace />;
  }
  
  // If authenticated and needs password change, redirect to password change page
  if (needsPasswordChange) {
    console.log("User needs to change password, redirecting to password change page");
    return <Navigate to={PATHS.CHANGE_PASSWORD} replace />;
  }
  
  // If authenticated and we have role, redirect to dashboard
  if (userRole) {
    console.log(`Redirecting user with role ${userRole} to dashboard`);
    const dashboardPath = getDashboardPath(userRole);
    console.log(`Dashboard path: ${dashboardPath}`);
    return <Navigate to={dashboardPath} replace />;
  }
  
  // If authenticated but no role yet, show loading and wait
  console.log("User authenticated but no role yet, waiting...");
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Configurando seu perfil...</p>
      </div>
    </div>
  );
};

export default RootLayout;
