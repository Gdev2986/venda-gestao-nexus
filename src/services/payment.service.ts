
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus } from "@/types";

/**
 * Gets a list of all payments with optional filtering
 */
export const getPayments = async (
  filters?: { clientId?: string; status?: PaymentStatus; startDate?: Date; endDate?: Date; }
): Promise<Payment[]> => {
  try {
    // Start building the query
    let query = supabase
      .from('payments')
      .select(`
        *,
        client:clients(id, business_name)
      `);

    // Apply filters if they exist
    if (filters?.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters?.status) {
      // Normalize status to match the enum
      const normalizedStatus = filters.status.toString();
      query = query.eq('status', normalizedStatus);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }

    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }

    // Execute the query
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }

    // Transform to match our Payment interface
    return data.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status as PaymentStatus,
      client_id: payment.client_id,
      created_at: payment.created_at,
      updated_at: payment.updated_at,
      approved_at: payment.approved_at,
      receipt_url: payment.receipt_url,
      client_name: payment.client?.business_name,
      rejection_reason: payment.rejection_reason,
      payment_type: payment.payment_type,
      bank_info: payment.bank_info,
      document_url: payment.document_url,
      due_date: payment.due_date,
      pix_key: payment.pix_key,
      approved_by: payment.approved_by,
      description: payment.description,
      client: payment.client
    }));
  } catch (error) {
    console.error('Error in getPayments:', error);
    throw error;
  }
};

/**
 * Gets a single payment by ID
 */
export const getPaymentById = async (id: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching payment:', error);
      return null;
    }

    return {
      id: data.id,
      amount: data.amount,
      status: data.status as PaymentStatus,
      client_id: data.client_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      approved_at: data.approved_at,
      receipt_url: data.receipt_url,
      client_name: data.client?.business_name,
      rejection_reason: data.rejection_reason,
      payment_type: data.payment_type,
      bank_info: data.bank_info,
      document_url: data.document_url,
      due_date: data.due_date,
      pix_key: data.pix_key,
      approved_by: data.approved_by,
      description: data.description,
      client: data.client
    };
  } catch (error) {
    console.error('Error in getPaymentById:', error);
    return null;
  }
};

/**
 * Approves a payment
 */
export const approvePayment = async (paymentId: string, approverId: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.APPROVED,
        approved_at: new Date().toISOString(),
        approved_by: approverId,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error approving payment:', error);
      throw error;
    }

    return data as Payment;
  } catch (error) {
    console.error('Error in approvePayment:', error);
    return null;
  }
};

/**
 * Rejects a payment
 */
export const rejectPayment = async (paymentId: string, reason: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'REJECTED' as PaymentStatus,
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error rejecting payment:', error);
      throw error;
    }

    return data as Payment;
  } catch (error) {
    console.error('Error in rejectPayment:', error);
    return null;
  }
};

/**
 * Marks a payment as paid
 */
export const markPaymentAsPaid = async (paymentId: string): Promise<Payment | null> => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: 'PAID' as PaymentStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) {
      console.error('Error marking payment as paid:', error);
      throw error;
    }

    return data as Payment;
  } catch (error) {
    console.error('Error in markPaymentAsPaid:', error);
    return null;
  }
};
