
import { UserRole } from "@/types/enums";
import { PaymentStatus } from "@/types/enums";

/**
 * Converts a string to a PaymentStatus enum value
 */
export function toPaymentStatus(status: string | PaymentStatus): PaymentStatus {
  if (typeof status === 'string') {
    switch (status.toUpperCase()) {
      case 'PENDING': return PaymentStatus.PENDING;
      case 'APPROVED': return PaymentStatus.APPROVED;
      case 'REJECTED': return PaymentStatus.REJECTED;
      case 'PAID': return PaymentStatus.PAID;
      default: return PaymentStatus.PENDING;
    }
  }
  return status;
}

/**
 * Converts a string to a UserRole enum value
 */
export function toUserRole(role: string | UserRole): UserRole {
  if (typeof role === 'string') {
    const upperRole = role.toUpperCase();
    // Check if the role exists in the UserRole enum
    if (Object.values(UserRole).includes(upperRole as UserRole)) {
      return upperRole as UserRole;
    }
    // Default to USER role if not found
    return UserRole.USER;
  }
  return role;
}

/**
 * Type guard to check if a string is a valid UserRole
 */
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(UserRole).includes(role as UserRole);
}
