
import { Payment, PaymentStatus, PaymentType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { PaymentData } from "@/types/payment.types";
import { RealtimeChannel } from "@supabase/supabase-js";

export const formatPaymentStatus = (status: string): PaymentStatus => {
  switch (status) {
    case "PENDING":
      return PaymentStatus.PENDING;
    case "APPROVED":
      return PaymentStatus.APPROVED;
    case "REJECTED":
      return PaymentStatus.REJECTED;
    case "PAID":
      return PaymentStatus.PAID;
    default:
      return PaymentStatus.PENDING;
  }
};

export const formatPaymentRequest = (item: any): Payment => {
  return {
    id: item.id,
    amount: item.amount,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    client_id: item.client_id,
    description: item.description || "",
    payment_type: PaymentType.PIX,
    client_name: item.client?.business_name,
    receipt_url: item.receipt_url,
    rejection_reason: item.rejection_reason || null,
    approved_at: item.approved_at,
    pix_key: item.pix_key ? {
      id: item.pix_key.id,
      key: item.pix_key.key,
      type: item.pix_key.type,
      owner_name: item.pix_key.name
    } : undefined
  };
};

// Fetch payment data with optional filtering
export const fetchPaymentsData = async (
  statusFilter: PaymentStatus | "ALL" = "ALL",
  searchTerm: string = ""
): Promise<PaymentData[]> => {
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
    `)
    .order('created_at', { ascending: false });

  // Apply status filter if not set to "ALL"
  if (statusFilter !== "ALL") {
    query = query.eq('status', statusFilter);
  }

  // Apply search filter if provided
  if (searchTerm) {
    query = query.or(`client.business_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
  }

  const { data, error } = await query;
  
  if (error) throw error;
  
  // Ensure all required fields are present, including rejection_reason
  return (data || []).map(item => ({
    ...item,
    rejection_reason: item.rejection_reason || null  // Ensure rejection_reason is always present
  })) as PaymentData[];
};

// Approve a payment request
export const approvePaymentRequest = async (
  paymentId: string, 
  receiptUrl?: string | null
): Promise<void> => {
  const { error } = await supabase
    .from('payment_requests')
    .update({ 
      status: PaymentStatus.APPROVED,
      approved_at: new Date().toISOString(),
      approved_by: (await supabase.auth.getUser()).data.user?.id,
      receipt_url: receiptUrl
    })
    .eq('id', paymentId);
  
  if (error) throw error;
};

// Reject a payment request
export const rejectPaymentRequest = async (
  paymentId: string, 
  rejectionReason: string
): Promise<void> => {
  const { error } = await supabase
    .from('payment_requests')
    .update({ 
      status: PaymentStatus.REJECTED,
      rejection_reason: rejectionReason
    })
    .eq('id', paymentId);
  
  if (error) throw error;
};

// Set up a subscription to payment changes
export const setupPaymentSubscription = (
  callback: () => void
): RealtimeChannel => {
  return supabase
    .channel('payment_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'payment_requests' 
    }, () => {
      callback();
    })
    .subscribe();
};
