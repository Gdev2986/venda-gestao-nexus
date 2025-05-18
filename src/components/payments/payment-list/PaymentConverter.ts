
import { PixKey, Payment, PaymentRequest } from '@/types/payment.types';

/**
 * Converts payment data from the database to a consistent format
 * for use in components. This normalizes the structure between different parts
 * of the application.
 */
export const convertPayment = (payment: any): Payment => {
  if (!payment) {
    throw new Error('Invalid payment data provided to converter');
  }
  
  // Ensure all required fields are present
  const normalizedPayment: Payment = {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    status: payment.status,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    approved_at: payment.approved_at,
    approved_by: payment.approved_by || null,
    receipt_url: payment.receipt_url || null,
    description: payment.description || '',
    rejection_reason: payment.rejection_reason || null,
    payment_type: payment.payment_type,
    pix_key_id: payment.pix_key_id,
    client: payment.client || undefined,
    client_name: payment.client?.business_name || payment.client_name || 'Desconhecido'
  };

  // Handle pix_key with owner_name issue
  if (payment.pix_key) {
    const pixKey: PixKey = {
      id: payment.pix_key.id,
      key: payment.pix_key.key,
      type: payment.pix_key.type,
      name: payment.pix_key.name || '',
      owner_name: payment.pix_key.owner_name || payment.pix_key.name || '',
      is_default: payment.pix_key.is_default,
      user_id: payment.pix_key.user_id,
      created_at: payment.pix_key.created_at,
      updated_at: payment.pix_key.updated_at,
      bank_name: payment.pix_key.bank_name,
      key_type: payment.pix_key.key_type,
      is_active: payment.pix_key.is_active
    };
    
    normalizedPayment.pix_key = pixKey;
  }

  return normalizedPayment;
};

/**
 * Convert PaymentRequest to Payment
 */
export const convertRequestToPayment = (request: PaymentRequest): Payment => {
  return {
    ...request,
    rejection_reason: request.rejection_reason || null
  };
};
