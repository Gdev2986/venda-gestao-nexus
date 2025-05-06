
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequestStatus } from "@/types";

export const fetchPaymentRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*, pix_key:pix_key_id(*), client:client_id(business_name)');

    if (error) {
      throw error;
    }

    return data.map(request => ({
      ...request,
      status: request.status as PaymentRequestStatus
    }));
  } catch (error) {
    console.error("Error fetching payment requests:", error);
    throw error;
  }
};

export const approvePaymentRequest = async (id, approvedById) => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .update({
        status: PaymentRequestStatus.APPROVED,
        approved_at: new Date().toISOString(),
        approved_by: approvedById
      })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error approving payment request:", error);
    throw error;
  }
};

export const rejectPaymentRequest = async (id, reason) => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .update({
        status: PaymentRequestStatus.REJECTED,
        rejection_reason: reason
      })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error rejecting payment request:", error);
    throw error;
  }
};

export const createPaymentRequest = async (paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert([
        {
          client_id: paymentData.client_id,
          amount: paymentData.amount,
          description: paymentData.description,
          pix_key_id: paymentData.pix_key_id,
          status: PaymentRequestStatus.PENDING
        }
      ])
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating payment request:", error);
    throw error;
  }
};

// Added to fix missing functions in hooks
export const fetchPaymentsData = async () => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*, client:client_id(business_name)')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Adding missing functions required by hooks
export const setupPaymentSubscription = (callback) => {
  const subscription = supabase
    .channel('payments-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'payments' }, 
      payload => {
        callback(payload);
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(subscription);
  };
};

// Define the missing formatPaymentRequest function
export const formatPaymentRequest = (request) => {
  return {
    ...request,
    client_name: request.client?.business_name || 'Unknown Client',
    pix_key_type: request.pix_key?.type || null,
    pix_key_value: request.pix_key?.key || null,
    pix_owner: request.pix_key?.owner_name || null,
  };
};
