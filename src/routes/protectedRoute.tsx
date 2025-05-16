
import { Navigate, Outlet } from "react-router-dom";
import { PATHS } from "./paths";

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  redirectTo: string;
}

export const ProtectedRoute = ({ isAuthenticated, redirectTo }: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};
