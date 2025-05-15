
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
    case "ADMIN":
    case UserRole.MANAGER.toString():
    case "MANAGER":
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT.toString():
    case "CLIENT":
    case UserRole.USER.toString():
    case "USER":
      return PATHS.USER.DASHBOARD;
    case UserRole.PARTNER.toString():
    case "PARTNER":
      return PATHS.PARTNER.DASHBOARD;
    case UserRole.FINANCIAL.toString():
    case "FINANCIAL":
    case UserRole.FINANCE.toString():
    case "FINANCE":
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS.toString():
    case "LOGISTICS":
      return PATHS.LOGISTICS.DASHBOARD;
    case UserRole.SUPPORT.toString():
    case "SUPPORT":
      return PATHS.USER.DASHBOARD;
    default:
      console.log("Role não reconhecida:", userRole);
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
