
import { Payment } from '@/types';
import { PaymentRequest, PixKey } from '@/types/payment.types';

// Define a function to convert Payment to PaymentRequest
export const convertToPaymentRequest = (payment: Payment): PaymentRequest => {
  return {
    id: payment.id,
    client_id: payment.client_id,
    amount: payment.amount,
    description: payment.description || '',
    status: payment.status as any, // Cast to compatible type
    pix_key_id: payment.pix_key?.id || '',
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    approved_at: payment.approved_at || null,
    approved_by: null, // Default to null since Payment doesn't have this
    receipt_url: payment.receipt_url || null,
    rejection_reason: payment.rejection_reason,
    // Ensure pix_key is properly formatted
    pix_key: payment.pix_key ? {
      id: payment.pix_key.id || '',
      key: payment.pix_key.key || '',
      key_type: payment.pix_key.type as any || '',
      type: payment.pix_key.type || '',
      name: payment.pix_key.owner_name || '',
      owner_name: payment.pix_key.owner_name || '',
      isDefault: false,
      is_active: true,
      created_at: '',
      updated_at: '',
      bank_name: '',
    } : undefined,
    // Handle client property if it exists
    client: payment.client || {
      id: payment.client_id,
      business_name: payment.client_name || '',
      document: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      created_at: '',
      updated_at: '',
      status: 'ACTIVE',
    },
  };
};
