
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 * Handles case sensitivity and string/enum conversions
 */
export const getDashboardPath = (userRole: UserRole | string): string => {
  console.log("getDashboardPath - userRole:", userRole);
  
  // Normalize role to uppercase string for consistent comparison
  const normalizedRole = userRole?.toString().toUpperCase();
  
  switch (normalizedRole) {
    case UserRole.ADMIN.toString():
    case UserRole.MANAGER.toString():
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT.toString():
    case UserRole.USER.toString():
      return PATHS.USER.DASHBOARD;
    case UserRole.PARTNER.toString():
      return PATHS.PARTNER.DASHBOARD;
    case UserRole.FINANCIAL.toString():
    case UserRole.FINANCE.toString():
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS.toString():
      return PATHS.LOGISTICS.DASHBOARD;
    case UserRole.SUPPORT.toString():
      return PATHS.USER.DASHBOARD;
    default:
      console.log("Role não reconhecido:", userRole);
      // Default to login as a safe fallback
      return PATHS.LOGIN;
  }
};

/**
 * Returns the appropriate dashboard redirect path based on user role
 */
export const getDashboardRedirect = (userRole: UserRole | string): string => {
  return getDashboardPath(userRole);
};
