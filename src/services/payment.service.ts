import { supabase } from '@/integrations/supabase/client';
import { 
  Payment, 
  PaymentRequest, 
  PixKey,
  PaymentRequestStatus 
} from '@/types/payment.types';
import { PaymentStatus } from '@/types/enums';

// Helper function to convert payment status string to enum
function toPaymentStatus(status: string | PaymentStatus): PaymentStatus {
  if (typeof status === 'string') {
    switch (status) {
      case 'PENDING': return PaymentStatus.PENDING;
      case 'PROCESSING': return PaymentStatus.PROCESSING;
      case 'APPROVED': return PaymentStatus.APPROVED;
      case 'REJECTED': return PaymentStatus.REJECTED;
      case 'PAID': return PaymentStatus.PAID;
      default: return PaymentStatus.PENDING;
    }
  }
  return status;
}

/**
 * Get payment requests by status
 */
export async function getPaymentRequestsByStatus(status: PaymentStatus | string): Promise<PaymentRequest[]> {
  // Convert enum to string if needed
  const statusValue = typeof status === 'string' ? status : status.toString();

  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:client_id (*),
      pix_key:pix_key_id (*)
    `)
    .eq('status', statusValue);

  if (error) {
    console.error(`Error fetching payment requests with status ${status}:`, error);
    throw new Error(error.message);
  }

  // Need to cast data as it comes from database
  const paymentRequests = data.map(item => ({
    ...item,
    status: toPaymentStatus(item.status)
  })) as unknown as PaymentRequest[];

  return paymentRequests;
}

/**
 * Get all payment requests
 */
export async function getAllPaymentRequests(): Promise<PaymentRequest[]> {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:client_id (*),
      pix_key:pix_key_id (*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all payment requests:', error);
    throw new Error(error.message);
  }

  // Need to cast data as it comes from database
  const paymentRequests = data.map(item => ({
    ...item,
    status: toPaymentStatus(item.status)
  })) as unknown as PaymentRequest[];

  return paymentRequests;
}

/**
 * Create a new payment request
 */
export async function createPaymentRequest(
  clientId: string,
  amount: number,
  pixKeyId: string,
  description?: string
): Promise<PaymentRequest> {
  const { data, error } = await supabase
    .from('payment_requests')
    .insert({
      client_id: clientId,
      amount,
      pix_key_id: pixKeyId,
      description: description || 'Solicitação de pagamento',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating payment request:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toPaymentStatus(data.status)
  } as unknown as PaymentRequest;
}

/**
 * Approve a payment request
 */
export async function approvePaymentRequest(
  id: string,
  approvedBy: string,
  receiptUrl?: string
): Promise<PaymentRequest> {
  const updates: any = {
    status: PaymentStatus.APPROVED.toString(),
    approved_by: approvedBy,
    approved_at: new Date().toISOString(),
  };

  if (receiptUrl) {
    updates.receipt_url = receiptUrl;
  }

  const { data, error } = await supabase
    .from('payment_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error approving payment request:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toPaymentStatus(data.status)
  } as unknown as PaymentRequest;
}

/**
 * Reject a payment request
 */
export async function rejectPaymentRequest(
  id: string,
  rejectionReason: string
): Promise<PaymentRequest> {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({
      status: PaymentStatus.REJECTED.toString(),
      rejection_reason: rejectionReason,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error rejecting payment request:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toPaymentStatus(data.status)
  } as unknown as PaymentRequest;
}

/**
 * Get a payment request by ID
 */
export async function getPaymentRequestById(id: string): Promise<PaymentRequest> {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:client_id (*),
      pix_key:pix_key_id (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching payment request with id ${id}:`, error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toPaymentStatus(data.status)
  } as unknown as PaymentRequest;
}

/**
 * Get payment requests for a client
 */
export async function getClientPayments(clientId: string): Promise<Payment[]> {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:client_id (*),
      pix_key:pix_key_id (*)
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching payment requests for client ${clientId}:`, error);
    throw new Error(error.message);
  }

  // Need to cast data as it comes from database
  const paymentRequests = data.map(item => ({
    ...item,
    status: toPaymentStatus(item.status)
  })) as unknown as Payment[];

  return paymentRequests;
}
