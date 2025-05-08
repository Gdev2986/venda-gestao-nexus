
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
    case UserRole.MANAGER:
    case UserRole.FINANCE:
    case UserRole.SUPPORT:
    case UserRole.USER:
      // Mapeamento de outros tipos para rotas padrão
      return PATHS.USER.DASHBOARD;
    default:
      console.log("Role não reconhecido:", userRole);
      // Em vez de redirecionar para o login quando não reconhecermos o papel
      // vamos redirecionar para um caminho padrão
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
