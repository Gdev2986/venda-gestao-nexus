
import { Payment } from "@/types";
import { PaymentData } from "@/hooks/payments/payment.types";
import { toPaymentStatus } from "@/lib/type-utils";

/**
 * Converts a Payment to a PaymentRequest
 */
export function convertToPaymentRequest(payment: Payment): PaymentData {
  return {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    status: payment.status,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    approved_by: payment.approved_by || undefined,
    approved_at: payment.approved_at || undefined,
    receipt_url: payment.receipt_url || undefined,
    description: payment.description || undefined,
    rejection_reason: payment.rejection_reason || null,
    ...(payment.client ? { client: payment.client } : {}),
    ...(payment.pix_key ? { pix_key: payment.pix_key } : {})
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
