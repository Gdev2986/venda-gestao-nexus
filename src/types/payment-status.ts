
import { PaymentStatus } from "@/types";

/**
 * List of valid payment statuses in the database
 */
export const DB_PAYMENT_STATUSES = ['PENDING', 'APPROVED', 'REJECTED', 'PAID'] as const;

/**
 * Type representing the valid database payment statuses
 */
export type DBPaymentStatus = typeof DB_PAYMENT_STATUSES[number];

/**
 * Safely converts a PaymentStatus enum value to a DBPaymentStatus string that can be used in database queries
 * @param status The PaymentStatus enum value
 * @returns A safe DBPaymentStatus string or undefined if the status is not valid
 */
export function toDBPaymentStatus(status: PaymentStatus | string | null | undefined): DBPaymentStatus | undefined {
  if (!status) return undefined;
  
  // Check if the status is already a valid DBPaymentStatus
  if (DB_PAYMENT_STATUSES.includes(status as DBPaymentStatus)) {
    return status as DBPaymentStatus;
  }
  
  // Convert enum to string if it's an enum value
  const statusStr = String(status).toUpperCase();
  
  // Map the status to a valid DBPaymentStatus if possible
  switch (statusStr) {
    case 'PENDING': return 'PENDING';
    case 'APPROVED': return 'APPROVED';
    case 'REJECTED': return 'REJECTED';
    case 'PAID': return 'PAID';
    default:
      return undefined;
  }
}
