
import { UserRole } from "@/types";
import { PATHS } from "./paths";

/**
 * Get the appropriate dashboard redirect path based on user role
 */
export const getDashboardRedirect = (role: UserRole | string): string => {
  switch (role) {
    case UserRole.ADMIN:
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT:
      return PATHS.USER.DASHBOARD;
    case UserRole.FINANCIAL:
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS:
      return PATHS.LOGISTICS.DASHBOARD;
    case UserRole.PARTNER:
      return PATHS.PARTNER.DASHBOARD;
    default:
      return PATHS.USER.DASHBOARD;
  }
};
