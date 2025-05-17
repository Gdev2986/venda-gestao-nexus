
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
    description: dbPayment.description || "", // Ensure description is never undefined
    status: dbPayment.status as PaymentRequestStatusType,
    pix_key_id: dbPayment.pix_key_id,
    created_at: dbPayment.created_at,
    updated_at: dbPayment.updated_at || dbPayment.created_at, // Ensure updated_at is present
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
 */
export const convertToPaymentRequest = (payment: Payment): PaymentData => {
  return {
    id: payment.id,
    amount: payment.amount,
    description: payment.description || "", // Ensure description is never undefined
    status: payment.status as PaymentRequestStatusType,
    pix_key_id: payment.pix_key?.id,
    created_at: payment.created_at,
    updated_at: payment.updated_at || payment.created_at, // Ensure updated_at is present
    approved_at: payment.approved_at || null,
    approved_by: payment.approved_by || null,
    receipt_url: payment.receipt_url || null,
    rejection_reason: payment.rejection_reason || null,
    client_id: payment.client_id,
    payment_type: payment.payment_type || PaymentType.PIX,
    pix_key: payment.pix_key,
    client: payment.client,
    bank_info: payment.bank_info,
    document_url: payment.document_url,
    due_date: payment.due_date
  };
};
