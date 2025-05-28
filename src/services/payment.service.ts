
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentProcessParams } from "@/types/payment.types";
import { PaymentStatus } from "@/types";

// Get all payment requests
export const getPaymentRequests = async (): Promise<PaymentRequest[]> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert database enum strings to PaymentStatus enum
  return (data || []).map(payment => ({
    ...payment,
    status: payment.status as PaymentStatus,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    rejection_reason: payment.rejection_reason || undefined
  }));
};

// Get payment requests for a specific client
export const getClientPayments = async (clientId: string): Promise<PaymentRequest[]> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Convert database enum strings to PaymentStatus enum
  return (data || []).map(payment => ({
    ...payment,
    status: payment.status as PaymentStatus,
    created_at: payment.created_at,
    updated_at: payment.updated_at,
    rejection_reason: payment.rejection_reason || undefined
  }));
};

// Get payment request by ID
export const getPaymentRequestById = async (id: string): Promise<PaymentRequest | null> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    ...data,
    status: data.status as PaymentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
    rejection_reason: data.rejection_reason || undefined
  };
};

// Create payment request
export const createPaymentRequest = async (paymentData: {
  client_id: string;
  amount: number;
  description?: string;
  pix_key_id: string;
}): Promise<PaymentRequest> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .insert({
      ...paymentData,
      status: PaymentStatus.PENDING
    })
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .single();

  if (error) throw error;

  return {
    ...data,
    status: data.status as PaymentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
    rejection_reason: data.rejection_reason || undefined
  };
};

// Process payment (approve/reject)
export const processPayment = async (params: PaymentProcessParams): Promise<PaymentRequest> => {
  const updateData: any = {
    status: params.status,
    processed_at: new Date().toISOString(),
    processed_by: (await supabase.auth.getUser()).data.user?.id
  };

  if (params.notes) {
    if (params.status === PaymentStatus.REJECTED) {
      updateData.rejection_reason = params.notes;
    }
  }

  const { data, error } = await supabase
    .from('payment_requests')
    .update(updateData)
    .eq('id', params.payment_id)
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .single();

  if (error) throw error;

  return {
    ...data,
    status: data.status as PaymentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
    rejection_reason: data.rejection_reason || undefined
  };
};

// Delete payment request
export const deletePaymentRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payment_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

// Update payment receipt
export const updatePaymentReceipt = async (id: string, receiptUrl: string): Promise<PaymentRequest> => {
  const { data, error } = await supabase
    .from('payment_requests')
    .update({ receipt_url: receiptUrl })
    .eq('id', id)
    .select(`
      *,
      client:clients(id, business_name),
      processor:profiles(id, name)
    `)
    .single();

  if (error) throw error;

  return {
    ...data,
    status: data.status as PaymentStatus,
    created_at: data.created_at,
    updated_at: data.updated_at,
    rejection_reason: data.rejection_reason || undefined
  };
};

// Get payment statistics
export const getPaymentStats = async () => {
  const { data, error } = await supabase
    .from('payment_requests')
    .select('status, amount, created_at');

  if (error) throw error;

  const payments = data || [];
  const total = payments.length;
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const statusCounts = payments.reduce((acc, payment) => {
    acc[payment.status] = (acc[payment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total,
    totalAmount,
    pending: statusCounts[PaymentStatus.PENDING] || 0,
    approved: statusCounts[PaymentStatus.APPROVED] || 0,
    rejected: statusCounts[PaymentStatus.REJECTED] || 0,
    paid: statusCounts[PaymentStatus.PAID] || 0,
    byStatus: statusCounts
  };
};
