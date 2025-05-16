
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";
import { getDashboardRedirect } from "./routeUtils";
import { useUserRole } from "@/hooks/use-user-role";

interface GuestRouteProps {
  isAuthenticated: boolean;
}

export const GuestRoute = ({ isAuthenticated }: GuestRouteProps) => {
  const { userRole } = useUserRole();
  
  if (isAuthenticated && userRole) {
    // Redirect to the appropriate dashboard based on role
    const redirectPath = getDashboardRedirect(userRole);
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};
