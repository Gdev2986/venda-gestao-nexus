
import { PaymentStatus } from "@/types";

// Define the PaymentRequest type
export interface PaymentRequest {
  id: string;
  client_id: string;
  amount: number;
  status: string | PaymentStatus;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
  receipt_url?: string;
  description?: string;
  rejection_reason?: string;
}

// Define the PaymentRequestStatus enum type
export type PaymentRequestStatus = PaymentStatus | string;

// Options for the usePayments hook
export interface UsePaymentsOptions {
  statusFilter?: PaymentRequestStatus | "ALL";
  searchTerm?: string;
  fetchOnMount?: boolean;
}

// Export the PaymentData type explicitly 
export type PaymentData = PaymentRequest;
