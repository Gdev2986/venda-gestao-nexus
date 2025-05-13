
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 * Handles case sensitivity and string/enum conversions
 */
export const getDashboardPath = (userRole: UserRole): string => {
  console.log("getDashboardPath - userRole:", userRole);
  
  // Normalize role to uppercase string for consistent comparison
  const normalizedRole = userRole?.toString().toUpperCase();
  
  switch (normalizedRole) {
    case "ADMIN":
    case "MANAGER":
      return PATHS.ADMIN.DASHBOARD;
    case "CLIENT":
    case "USER":
      return PATHS.USER.DASHBOARD;
    case "PARTNER":
      return PATHS.PARTNER.DASHBOARD;
    case "FINANCIAL":
    case "FINANCE":
      return PATHS.FINANCIAL.DASHBOARD;
    case "LOGISTICS":
      return PATHS.LOGISTICS.DASHBOARD;
    case "SUPPORT":
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
export const getDashboardRedirect = (userRole: UserRole): string => {
  return getDashboardPath(userRole);
};
