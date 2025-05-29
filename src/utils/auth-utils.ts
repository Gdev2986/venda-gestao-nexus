
import { UserRole } from "@/types/enums";
import { PATHS } from "@/routes/paths";

export const getDashboardPath = (userRole: any): string => {
  console.log("getDashboardPath called with role:", userRole);

  if (!userRole || !isValidUserRole(userRole)) {
    console.warn("Invalid or missing user role, redirecting to login");
    return PATHS.LOGIN;
  }

  // Convert string to enum if needed
  const role = typeof userRole === 'string' ? userRole.toUpperCase() : userRole;

  switch (role) {
    case UserRole.ADMIN:
    case 'ADMIN':
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT:
    case 'CLIENT':
      return PATHS.CLIENT.DASHBOARD;
    case UserRole.PARTNER:
    case 'PARTNER':
      return PATHS.PARTNER.DASHBOARD;
    case UserRole.FINANCIAL:
    case 'FINANCIAL':
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS:
    case 'LOGISTICS':
      return PATHS.LOGISTICS.DASHBOARD;
    default:
      console.warn("Unhandled user role:", userRole);
      return PATHS.LOGIN;
  }
};

export const isValidUserRole = (role: any): role is UserRole => {
  console.log("isValidUserRole checking role:", role, "Type:", typeof role);
  
  if (!role) return false;
  
  // Convert to uppercase for comparison
  const roleUpper = typeof role === 'string' ? role.toUpperCase() : role;
  const validRoles = Object.values(UserRole);
  
  console.log("Valid roles:", validRoles);
  console.log("Role upper:", roleUpper);
  console.log("Is valid:", validRoles.includes(roleUpper));
  
  return validRoles.includes(roleUpper);
};
