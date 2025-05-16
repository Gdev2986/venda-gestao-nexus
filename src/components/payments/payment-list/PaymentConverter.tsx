
import { Payment } from "@/types";
import { PaymentData, PaymentRequest } from "@/hooks/payments/payment.types";

// Função para converter um objeto Payment para PaymentRequest para compatibilidade
export const convertToPaymentRequest = (payment: Payment): PaymentRequest => {
  return {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    description: payment.description || "",
    status: payment.status as any,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    receipt_url: payment.receipt_url || null,
    pix_key_id: payment.pix_key?.id,
    approved_at: payment.approved_at || null,
    approved_by: payment.approved_by || null,
    rejection_reason: payment.rejection_reason || null,
    client: payment.client,
    pix_key: payment.pix_key,
    payment_type: payment.payment_type,
    due_date: payment.due_date
  };
};

// Função para converter um objeto PaymentRequest para Payment para compatibilidade
export const convertToPayment = (paymentRequest: PaymentRequest): Payment => {
  return {
    id: paymentRequest.id,
    client_id: paymentRequest.client_id,
    amount: paymentRequest.amount,
    description: paymentRequest.description,
    status: paymentRequest.status as any,
    created_at: paymentRequest.created_at,
    updated_at: paymentRequest.updated_at,
    receipt_url: paymentRequest.receipt_url,
    approved_at: paymentRequest.approved_at,
    approved_by: paymentRequest.approved_by,
    rejection_reason: paymentRequest.rejection_reason,
    client: paymentRequest.client,
    pix_key: paymentRequest.pix_key,
    payment_type: paymentRequest.payment_type,
    due_date: paymentRequest.due_date
  };
};
