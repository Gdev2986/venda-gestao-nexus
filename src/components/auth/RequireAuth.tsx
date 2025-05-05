
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { PATHS } from "@/routes/paths";
import { UserRole } from "@/types";

export interface RequireAuthProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { userRole, isRoleLoading } = useUserRole();
  
  // If we're still loading the user role, return nothing (or a loading spinner)
  if (isRoleLoading) {
    return <div>Loading...</div>;
  }

  // If there's no user, or no role, redirect to login
  if (!userRole) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to for a smoother user experience
    return <Navigate to={PATHS.LOGIN} state={{ from: location }} replace />;
  }

  // Check if the user has an allowed role
  if (!allowedRoles.includes(userRole)) {
    // If not an allowed role, redirect to the home page
    return <Navigate to={PATHS.HOME} replace />;
  }

  // If they're allowed, render the child components
  return <>{children}</>;
};

export default RequireAuth;
