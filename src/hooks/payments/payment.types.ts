
import { PaymentRequest, PaymentRequestStatus } from "@/types/payment.types";

// Options for the usePayments hook
export interface UsePaymentsOptions {
  statusFilter?: PaymentRequestStatus | "ALL";
  searchTerm?: string;
  fetchOnMount?: boolean;
}

// Export the PaymentData type that's being referenced in other files
export type PaymentData = PaymentRequest;
