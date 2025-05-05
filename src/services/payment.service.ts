
import { supabase } from "@/integrations/supabase/client";
import { PaymentData, PaymentStatus } from "@/types/payment.types";

export const fetchPaymentsData = async (
  statusFilter: PaymentStatus | "ALL" = "ALL",
  searchTerm: string = ""
) => {
  let query = supabase
    .from('payment_requests')
    .select(`
      *,
      pix_key:pix_key_id (
        id,
        key,
        type,
        name
      ),
      client:client_id (
        id,
        business_name,
        email
      )
    `);
    
  // Apply status filter if it's not ALL
  if (statusFilter !== "ALL") {
    query = query.eq('status', statusFilter);
  }
  
  // Apply search filter if provided
  if (searchTerm) {
    query = query.or(`
      client.business_name.ilike.%${searchTerm}%,
      description.ilike.%${searchTerm}%
    `);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Map data to our internal format
  const formattedData = (data || []).map((payment) => {
    return {
      ...payment,
      status: payment.status as PaymentStatus,
      rejection_reason: payment.rejection_reason || null,
      approved_at: payment.approved_at || null,
      approved_by: payment.approved_by || null,
      receipt_url: payment.receipt_url || null
    } as PaymentData;
  });
  
  return formattedData;
};

export const approvePaymentRequest = async (paymentId: string, receiptUrl?: string | null) => {
  const updateData: any = { 
    status: 'APPROVED',
    approved_at: new Date().toISOString(),
  };
  
  if (receiptUrl) {
    updateData.receipt_url = receiptUrl;
  }
  
  const { error } = await supabase
    .from('payment_requests')
    .update(updateData)
    .eq('id', paymentId);

  if (error) throw error;
  
  return true;
};

export const rejectPaymentRequest = async (paymentId: string, rejectionReason: string) => {
  const { error } = await supabase
    .from('payment_requests')
    .update({ 
      status: 'REJECTED', 
      rejection_reason: rejectionReason 
    })
    .eq('id', paymentId);

  if (error) throw error;
  
  return true;
};

export const setupPaymentSubscription = (callback: () => void) => {
  const channel = supabase
    .channel('payment_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'payment_requests' 
    }, () => {
      callback();
    })
    .subscribe();

  return channel;
};
