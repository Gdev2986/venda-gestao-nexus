
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PATHS } from "./paths";

interface GuestRouteProps {
  isAuthenticated: boolean;
}

export const GuestRoute = ({ isAuthenticated }: GuestRouteProps) => {
  const location = useLocation();
  
  if (isAuthenticated) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }
  
  return <Outlet />;
};
