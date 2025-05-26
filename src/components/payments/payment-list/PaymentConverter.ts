
import { PaymentRequest, PaymentStatus, PaymentMethod, PixKey, PixKeyType } from '@/types/payment.types';

export const convertToPayment = (paymentRequest: any) => {
  return {
    id: paymentRequest.id,
    client_id: paymentRequest.client_id,
    amount: paymentRequest.amount,
    status: paymentRequest.status as PaymentStatus,
    approved_by: paymentRequest.approved_by,
    approved_at: paymentRequest.approved_at,
    created_at: paymentRequest.created_at,
    updated_at: paymentRequest.updated_at,
    receipt_url: paymentRequest.receipt_url,
    description: paymentRequest.description,
    rejection_reason: paymentRequest.rejection_reason,
    payment_type: 'PIX',
    client: paymentRequest.client,
    method: PaymentMethod.PIX,
    requested_at: paymentRequest.created_at || paymentRequest.requested_at,
    pix_key_id: paymentRequest.pix_key_id
  };
};

export const convertToPixKey = (pixKeyData: any): PixKey => {
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
    bank_name: pixKeyData.bank_name
  };
};
