
import { UserRole } from "@/types";
import { PATHS } from "@/routes/paths";

export const getDashboardPath = (userRole: UserRole | null): string => {
  console.log("getDashboardPath called with role:", userRole);
  
  if (!userRole) {
    console.log("No user role provided, redirecting to login");
    return PATHS.LOGIN;
  }

  switch (userRole) {
    case UserRole.ADMIN:
      return PATHS.ADMIN.DASHBOARD;
    case UserRole.CLIENT:
      return PATHS.CLIENT.DASHBOARD;
    case UserRole.PARTNER:
      return PATHS.PARTNER.DASHBOARD;
    case UserRole.FINANCIAL:
      return PATHS.FINANCIAL.DASHBOARD;
    case UserRole.LOGISTICS:
      return PATHS.LOGISTICS.DASHBOARD;
    default:
      console.warn("Unknown user role:", userRole, "defaulting to client dashboard");
      return PATHS.CLIENT.DASHBOARD;
  }
};

export const isValidUserRole = (role: any): role is UserRole => {
  return Object.values(UserRole).includes(role);
};
