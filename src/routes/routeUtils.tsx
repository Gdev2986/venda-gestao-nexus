
import { Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard redirect based on user role
 */
export const getDashboardRedirect = (userRole: UserRole) => {
  switch (userRole) {
    case UserRole.ADMIN:
      return <Navigate to={PATHS.ADMIN.DASHBOARD} replace />;
    case UserRole.CLIENT:
      return <Navigate to={PATHS.USER.DASHBOARD} replace />;
    case UserRole.PARTNER:
      return <Navigate to={PATHS.PARTNER.DASHBOARD} replace />;
    case UserRole.FINANCIAL:
      return <Navigate to={PATHS.FINANCIAL.DASHBOARD} replace />;
    case UserRole.LOGISTICS:
      return <Navigate to={PATHS.LOGISTICS.DASHBOARD} replace />;
    default:
      return <Navigate to={PATHS.USER.DASHBOARD} replace />;
  }
};
