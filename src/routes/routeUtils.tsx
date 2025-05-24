import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 * Each role has its specific dashboard route
 */
export const getDashboardPath = (userRole: UserRole): string => {
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
    case "FINANCE":
      return PATHS.FINANCIAL.DASHBOARD;
    case "LOGISTICS":
      return PATHS.LOGISTICS.DASHBOARD;
    case "USER":
      // User role maps to client dashboard
      return PATHS.CLIENT.DASHBOARD;
    default:
      console.log("Role não reconhecido:", userRole);
      // Default to login as a safe fallback
      return PATHS.LOGIN;
  }
};

/**
 * Checks if a user role has access to a specific path
 */
export const hasRoleAccess = (userRole: UserRole, path: string): boolean => {
  const normalizedRole = userRole?.toString().toUpperCase();
  
  switch (normalizedRole) {
    case "ADMIN":
      // Admin has access to all routes
      return true;
    case "CLIENT":
    case "USER":
      return path.startsWith("/client");
    case "PARTNER":
      return path.startsWith("/partner");
    case "FINANCIAL":
    case "FINANCE":
      return path.startsWith("/financial");
    case "LOGISTICS":
      return path.startsWith("/logistics");
    default:
      return false;
  }
};

/**
 * Returns the appropriate dashboard redirect path based on user role
 */
export const getDashboardRedirect = (userRole: UserRole): string => {
  return getDashboardPath(userRole);
};
