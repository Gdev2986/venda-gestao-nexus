
import { PaymentRequest, Payment, PaymentMethod, PixKey, PixKeyType } from "@/types/payment.types";

export const convertPaymentRequestToPayment = (paymentRequest: any): Payment => {
  return {
    id: paymentRequest.id,
    client_id: paymentRequest.client_id,
    amount: paymentRequest.amount,
    status: paymentRequest.status,
    method: PaymentMethod.PIX, // Default to PIX since payment requests are PIX-based
    approved_by: paymentRequest.approved_by,
    approved_at: paymentRequest.approved_at,
    created_at: paymentRequest.created_at || paymentRequest.requested_at,
    updated_at: paymentRequest.updated_at,
    requested_at: paymentRequest.created_at || paymentRequest.requested_at,
    receipt_url: paymentRequest.receipt_url,
    description: paymentRequest.description,
    rejection_reason: paymentRequest.rejection_reason,
    payment_type: paymentRequest.payment_type,
    client: paymentRequest.client,
  };
};

export const convertPixKeyData = (pixKeyData: any): PixKey => {
  return {
    id: pixKeyData.id,
    key: pixKeyData.key,
    type: pixKeyData.type as PixKeyType,
    name: pixKeyData.name,
    owner_name: pixKeyData.owner_name,
    user_id: pixKeyData.user_id,
    is_default: pixKeyData.is_default || false,
    created_at: pixKeyData.created_at || new Date().toISOString(),
    updated_at: pixKeyData.updated_at || new Date().toISOString(),
    bank_name: pixKeyData.bank_name,
  };
};
