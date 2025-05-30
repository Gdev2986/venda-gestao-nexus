
import { PaymentStatus } from "@/types/enums";
import { PaymentRequest as BasePaymentRequest, Payment as BasePayment } from "@/types/payment.types";

// Update to use PaymentStatus enum
export type PaymentRequestStatus = PaymentStatus;

export interface UsePaymentsOptions {
  statusFilter?: string;
  searchTerm?: string;
  fetchOnMount?: boolean;
  page?: number;
  pageSize?: number;
}

export interface PaymentRequest extends BasePaymentRequest {
  // This ensures compatibility with the other PaymentRequest type
}

export type PixKeyType = 'CPF' | 'CNPJ' | 'EMAIL' | 'PHONE' | 'EVP';

// Make PaymentData type compatible with both systems
export type PaymentData = BasePayment;
