
import { UserRole } from "@/types";

/**
 * List of valid roles in the database
 * This is used to safely validate role values used in database queries
 */
export const DB_USER_ROLES = ['ADMIN', 'FINANCIAL', 'PARTNER', 'LOGISTICS', 'CLIENT'] as const;

/**
 * Type representing the valid database roles
 */
export type DBUserRole = typeof DB_USER_ROLES[number];

/**
 * Safely converts a UserRole enum value to a DBUserRole string that can be used in database queries
 * @param role The UserRole enum value
 * @returns A safe DBUserRole string or undefined if the role is not valid
 */
export function toDBRole(role: UserRole | string | null | undefined): DBUserRole | undefined {
  if (!role) return undefined;
  
  // Check if the role is already a valid DBUserRole
  if (DB_USER_ROLES.includes(role as DBUserRole)) {
    return role as DBUserRole;
  }
  
  // Convert enum to string if it's an enum value
  const roleStr = String(role).toUpperCase();
  
  // Map the role to a valid DBUserRole if possible
  switch (roleStr) {
    case 'ADMIN': return 'ADMIN';
    case 'FINANCIAL': return 'FINANCIAL';
    case 'PARTNER': return 'PARTNER'; 
    case 'LOGISTICS': return 'LOGISTICS';
    case 'CLIENT': return 'CLIENT';
    case 'MANAGER': 
      // If database doesn't have MANAGER role, map to ADMIN
      return 'ADMIN';
    case 'FINANCE':
      // Map to FINANCIAL
      return 'FINANCIAL';
    case 'SUPPORT':
      // Map to ADMIN
      return 'ADMIN';
    case 'USER':
      // Map to CLIENT
      return 'CLIENT';
    default:
      return undefined;
  }
}
