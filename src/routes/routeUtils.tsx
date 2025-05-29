
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 * Handles case sensitivity and string/enum conversions
 */
export const getDashboardPath = (userRole: UserRole | null): string => {
  if (!userRole) {
    console.log("No user role provided, redirecting to login");
    return PATHS.LOGIN;
  }
  
  console.log("getDashboardPath - userRole:", userRole);
  
  // Normalize role to uppercase string for consistent comparison
  const normalizedRole = userRole?.toString().toUpperCase();
  
  switch (normalizedRole) {
    case "ADMIN":
      return PATHS.ADMIN.DASHBOARD;
    case "CLIENT":
      return PATHS.CLIENT.DASHBOARD;
    case "PARTNER":
      return PATHS.PARTNER.DASHBOARD;
    case "FINANCIAL":
      return PATHS.FINANCIAL.DASHBOARD;
    case "LOGISTICS":
      return PATHS.LOGISTICS.DASHBOARD;
    case "MANAGER":
    case "FINANCE":
    case "SUPPORT":
    case "CLIENT":
      return PATHS.CLIENT.DASHBOARD;
    default:
      console.log("Role não reconhecido:", userRole);
      // Default to login as a safe fallback
      return PATHS.LOGIN;
  }
};

/**
 * Returns the appropriate dashboard redirect path based on user role
 */
export const getDashboardRedirect = (userRole: UserRole | null): string => {
  const path = getDashboardPath(userRole);
  return path;
};
