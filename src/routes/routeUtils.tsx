
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 */
export const getDashboardPath = (userRole: UserRole): string => {
  switch (userRole) {
    case UserRole.ADMIN:
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT:
      return PATHS.USER.DASHBOARD;
    case UserRole.PARTNER:
      return PATHS.PARTNER.DASHBOARD;
    case UserRole.FINANCIAL:
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS:
      return PATHS.LOGISTICS.DASHBOARD;
    default:
      return PATHS.USER.DASHBOARD;
  }
};

/**
 * Returns the appropriate dashboard redirect based on user role
 */
export const getDashboardRedirect = (userRole: UserRole) => {
  const path = getDashboardPath(userRole);
  return path;
};
