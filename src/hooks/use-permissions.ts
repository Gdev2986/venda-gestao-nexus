
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types';
import { castToUserRole, isValidUserRole } from '@/utils/auth-utils';

export const usePermissions = () => {
  const { userRole } = useAuth();

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    const currentRole = castToUserRole(userRole);
    return currentRole === requiredRole;
  };

  const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    const currentRole = castToUserRole(userRole);
    return requiredRoles.includes(currentRole);
  };

  const isAdmin = (): boolean => {
    return hasRole(UserRole.ADMIN);
  };

  const isClient = (): boolean => {
    return hasRole(UserRole.CLIENT);
  };

  const isPartner = (): boolean => {
    return hasRole(UserRole.PARTNER);
  };

  const isLogistics = (): boolean => {
    return hasRole(UserRole.LOGISTICS);
  };

  const isFinancial = (): boolean => {
    return hasRole(UserRole.FINANCIAL);
  };

  const canManageClients = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.LOGISTICS]);
  };

  const canManagePayments = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.FINANCIAL]);
  };

  const canViewReports = (): boolean => {
    return hasAnyRole([UserRole.ADMIN, UserRole.FINANCIAL, UserRole.PARTNER]);
  };

  const getCurrentRole = (): UserRole => {
    return castToUserRole(userRole || '');
  };

  return {
    hasRole,
    hasAnyRole,
    isAdmin,
    isClient,
    isPartner,
    isLogistics,
    isFinancial,
    canManageClients,
    canManagePayments,
    canViewReports,
    getCurrentRole,
    userRole: getCurrentRole()
  };
};

