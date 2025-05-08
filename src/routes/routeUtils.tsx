
import { PATHS } from "./paths";
import { UserRole } from "@/types";

/**
 * Returns the appropriate dashboard path based on user role
 */
export const getDashboardPath = (userRole: UserRole): string => {
  console.log("getDashboardPath - userRole:", userRole);
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
      console.log("Role não reconhecido:", userRole);
      // Em vez de redirecionar para o dashboard do usuário quando não reconhecermos o papel
      // vamos redirecionar para o login para evitar loops infinitos
      return PATHS.LOGIN;
  }
};

/**
 * Returns the appropriate dashboard redirect path based on user role
 */
export const getDashboardRedirect = (userRole: UserRole): string => {
  const path = getDashboardPath(userRole);
  return path;
};
