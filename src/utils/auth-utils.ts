
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
