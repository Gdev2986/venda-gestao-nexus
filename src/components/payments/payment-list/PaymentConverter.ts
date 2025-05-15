
import { Payment } from "@/types";
import { PaymentData, PaymentRequestStatus } from "@/hooks/payments/payment.types";

/**
 * Converts a Payment to a PaymentRequest
 */
export function convertToPaymentRequest(payment: Payment): PaymentData {
  return {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    status: payment.status as PaymentRequestStatus,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    approved_by: payment.approved_at ? payment.client_id : null, // Use appropriate value
    approved_at: payment.approved_at || null,
    receipt_url: payment.receipt_url || null,
    description: payment.description || "",
    rejection_reason: payment.rejection_reason || null,
    ...(payment.client ? { client: payment.client } : {}),
    ...(payment.pix_key ? { pix_key: payment.pix_key, pix_key_id: payment.pix_key.id } : {})
  };
}

/**
 * Type guard to check if an object is a PaymentData
 */
export function isPaymentRequest(payment: any): payment is PaymentData {
  return payment && 
    typeof payment.id === 'string' &&
    typeof payment.client_id === 'string' &&
    typeof payment.amount === 'number';
}
