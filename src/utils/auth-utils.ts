
import { UserRole } from '@/types';

export const getDashboardPath = (role: UserRole | string): string => {
  const roleStr = typeof role === 'string' ? role : role.toString();
  
  switch (roleStr) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'LOGISTICS':
      return '/logistics/dashboard';
    case 'PARTNER':
      return '/partner/dashboard';
    case 'USER':
      return '/user/dashboard';
    default:
      return '/client/dashboard';
  }
};

export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const castToUserRole = (role: string): UserRole => {
  if (isValidUserRole(role)) {
    return role as UserRole;
  }
  return UserRole.CLIENT; // default fallback
};

