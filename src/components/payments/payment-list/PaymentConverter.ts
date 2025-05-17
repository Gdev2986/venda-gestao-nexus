
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { PaymentData, PaymentRequestStatus } from "@/types/payment.types";

/**
 * Type for payment request status
 */
type PaymentRequestStatusType = PaymentRequestStatus;

/**
 * Converts a payment from the database to the UI payment format
 */
export const convertDbPaymentToUiPayment = (dbPayment: any): PaymentData => {
  return {
    id: dbPayment.id,
    amount: dbPayment.amount,
    description: dbPayment.description || "",
    status: dbPayment.status as PaymentRequestStatusType,
    pix_key_id: dbPayment.pix_key_id,
    created_at: dbPayment.created_at,
    updated_at: dbPayment.updated_at,
    approved_at: dbPayment.approved_at,
    approved_by: dbPayment.approved_by,
    receipt_url: dbPayment.receipt_url,
    rejection_reason: dbPayment.rejection_reason,
    client_id: dbPayment.client_id,
    payment_type: dbPayment.payment_type || PaymentType.PIX,
    pix_key: dbPayment.pix_key ? {
      id: dbPayment.pix_key.id,
      key: dbPayment.pix_key.key,
      type: dbPayment.pix_key.type,
      owner_name: dbPayment.pix_key.name,
      key_type: dbPayment.pix_key.key_type || "CPF"
    } : undefined,
    client: dbPayment.client,
    bank_info: dbPayment.bank_info,
    document_url: dbPayment.document_url,
    due_date: dbPayment.due_date
  };
};

/**
 * Convert a payment to the payment request format
 * (Added for compatibility with existing code)
 */
export const convertToPaymentRequest = convertDbPaymentToUiPayment;
