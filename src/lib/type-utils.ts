
import { UserRole, PaymentStatus } from "@/types";

/**
 * Safely converts a string to a UserRole enum value
 * If the string is not a valid UserRole, it returns a default value
 */
export function toUserRole(role: string | null | undefined, defaultRole: UserRole = UserRole.CLIENT): UserRole {
  if (!role) return defaultRole;
  
  // Check if the provided role is a valid UserRole
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  
  return defaultRole;
}

/**
 * Safely converts a string to a PaymentStatus enum value
 * If the string is not a valid PaymentStatus, it returns a default value
 */
export function toPaymentStatus(status: string | null | undefined, defaultStatus: PaymentStatus = PaymentStatus.PENDING): PaymentStatus {
  if (!status) return defaultStatus;
  
  // Check if the provided status is a valid PaymentStatus
  if (Object.values(PaymentStatus).includes(status as PaymentStatus)) {
    return status as PaymentStatus;
  }
  
  return defaultStatus;
}
