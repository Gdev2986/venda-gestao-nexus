
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@/types/enums';

interface Permission {
  name: string;
  roles: UserRole[];
}

// Define common permissions
const PERMISSIONS: Record<string, Permission> = {
  VIEW_CLIENTS: { name: 'view_clients', roles: [UserRole.ADMIN, UserRole.PARTNER, UserRole.FINANCIAL] },
  EDIT_CLIENTS: { name: 'edit_clients', roles: [UserRole.ADMIN] },
  VIEW_MACHINES: { name: 'view_machines', roles: [UserRole.ADMIN, UserRole.LOGISTICS] },
  EDIT_MACHINES: { name: 'edit_machines', roles: [UserRole.ADMIN, UserRole.LOGISTICS] },
  VIEW_PAYMENTS: { name: 'view_payments', roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.CLIENT] },
  APPROVE_PAYMENTS: { name: 'approve_payments', roles: [UserRole.ADMIN, UserRole.FINANCIAL] },
  VIEW_SALES: { name: 'view_sales', roles: [UserRole.ADMIN, UserRole.FINANCIAL, UserRole.CLIENT] },
  EDIT_SALES: { name: 'edit_sales', roles: [UserRole.ADMIN, UserRole.FINANCIAL] },
  MANAGE_USERS: { name: 'manage_users', roles: [UserRole.ADMIN] },
};

export function usePermissions() {
  const { userRole, isLoading: isRoleLoading } = useAuth();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isRoleLoading && userRole) {
      // Calculate user permissions based on their role
      const userPermissions = Object.values(PERMISSIONS)
        .filter(permission => permission.roles.includes(userRole as UserRole))
        .map(permission => permission.name);
      
      setPermissions(userPermissions);
      setIsLoading(false);
    }
  }, [userRole, isRoleLoading]);

  // Check if user has a specific permission
  const hasPermission = useCallback((permissionName: string): boolean => {
    // Always allow ADMIN role to have all permissions
    if (userRole === UserRole.ADMIN) return true;
    
    // Check if the user has the specific permission
    const permission = PERMISSIONS[permissionName];
    if (!permission) return false;
    
    return permission.roles.includes(userRole as UserRole);
  }, [userRole]);

  // Check if user has any of the given permissions
  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    // Always allow ADMIN role to have all permissions
    if (userRole === UserRole.ADMIN) return true;
    
    return permissionNames.some(name => hasPermission(name));
  }, [userRole, hasPermission]);

  // Check if user has all of the given permissions
  const hasAllPermissions = useCallback((permissionNames: string[]): boolean => {
    // Always allow ADMIN role to have all permissions
    if (userRole === UserRole.ADMIN) return true;
    
    return permissionNames.every(name => hasPermission(name));
  }, [userRole, hasPermission]);

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isLoading,
    userRole,
  };
}
