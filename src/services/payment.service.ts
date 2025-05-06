
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
