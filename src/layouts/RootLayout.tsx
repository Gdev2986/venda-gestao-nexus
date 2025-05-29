
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PATHS } from "@/routes/paths";
import { getDashboardPath } from "@/utils/auth-utils";

const RootLayout = () => {
  const { user, isLoading, isAuthenticated, userRole, needsPasswordChange } = useAuth();
  const location = useLocation();
  
  // Debug logging
  console.log("RootLayout render status:", {
    isLoading,
    isAuthenticated,
    userRole,
    needsPasswordChange,
    path: location.pathname
  });
  
  // If still loading, show a simple spinner without delay
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If authenticated and needs password change, redirect to password change page
  if (isAuthenticated && user && needsPasswordChange) {
    console.log("User needs to change password, redirecting to password change page");
    return <Navigate to={PATHS.CHANGE_PASSWORD} replace />;
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
  
  // If not authenticated, redirect to login
  console.log("User not authenticated, redirecting to login");
  return <Navigate to={PATHS.LOGIN} replace />;
};

export default RootLayout;
