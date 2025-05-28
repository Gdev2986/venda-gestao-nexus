
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

/**
 * Retorna o caminho do dashboard baseado no role do usuário
 */
export const getDashboardPath = (userRole: UserRole | null): string => {
  if (!userRole) {
    console.log("No user role provided, redirecting to login");
    return PATHS.LOGIN;
  }
  
  console.log("getDashboardPath - userRole:", userRole);
  
  const normalizedRole = userRole.toString().toUpperCase();
  
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
    case "USER":
      return PATHS.USER.DASHBOARD;
    default:
      console.log("Role não reconhecido:", userRole);
      return PATHS.LOGIN;
  }
};

/**
 * Obter role do usuário do localStorage/sessionStorage
 */
export const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    // Tentar buscar do localStorage primeiro
    const storedRole = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (storedRole) {
      return storedRole as UserRole;
    }
    
    // Se não encontrar, retornar null para buscar do servidor
    return null;
  } catch (error) {
    console.error('Error fetching user role from storage:', error);
    return null;
  }
};

/**
 * Limpar todos os dados de autenticação
 */
export const cleanupAuthState = (): void => {
  try {
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('redirectPath');
    sessionStorage.removeItem('deviceId');
    localStorage.removeItem('userRole');
    
    // Remover todas as chaves relacionadas ao Supabase
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
    
    console.log("Auth state cleaned");
  } catch (error) {
    console.error("Error cleaning auth state:", error);
  }
};

/**
 * Verificar se o usuário tem permissão para acessar uma rota
 */
export const hasPermission = (userRole: UserRole | null, allowedRoles: UserRole[]): boolean => {
  if (!userRole || allowedRoles.length === 0) return false;
  return allowedRoles.includes(userRole);
};

/**
 * Redirecionar com base no role após login
 */
export const getRedirectPath = (userRole: UserRole | null): string => {
  const storedPath = sessionStorage.getItem("redirectPath");
  
  if (storedPath && storedPath !== "/" && storedPath !== PATHS.LOGIN) {
    sessionStorage.removeItem("redirectPath");
    return storedPath;
  }
  
  return getDashboardPath(userRole);
};
