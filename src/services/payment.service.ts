import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestParams, PaymentProcessParams, PaymentRequestStatus } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";

export const paymentService = {
  // Get all payment requests
  async getPaymentRequests(): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get payment request by ID
  async getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create payment request
  async createPaymentRequest(params: PaymentRequestParams): Promise<PaymentRequest> {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: params.client_id,
        amount: params.amount,
        method: params.method,
        notes: params.notes,
        status: PaymentStatus.PENDING
      })
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Process payment request
  async processPaymentRequest(params: PaymentProcessParams): Promise<PaymentRequest> {
    const updateData: any = {
      status: params.status,
      processed_at: new Date().toISOString(),
      notes: params.notes
    };

    if (params.status === PaymentStatus.APPROVED) {
      updateData.processed_at = new Date().toISOString();
    }

    if (params.status === PaymentStatus.REJECTED && params.notes) {
      updateData.rejection_reason = params.notes;
    }

    const { data, error } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', params.payment_id)
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Get payments by client
  async getPaymentsByClient(clientId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Update payment request
  async updatePaymentRequest(id: string, updates: Partial<PaymentRequest>): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, business_name, current_balance)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete payment request
  async deletePaymentRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Export individual functions for backward compatibility
export const getPaymentRequests = paymentService.getPaymentRequests;
export const getPaymentRequestById = paymentService.getPaymentRequestById;
export const createPaymentRequest = paymentService.createPaymentRequest;
export const processPaymentRequest = paymentService.processPaymentRequest;
export const getPaymentsByClient = paymentService.getPaymentsByClient;
export const updatePaymentRequest = paymentService.updatePaymentRequest;
export const deletePaymentRequest = paymentService.deletePaymentRequest;
