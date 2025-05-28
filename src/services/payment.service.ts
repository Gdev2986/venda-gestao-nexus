
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestParams, PaymentProcessParams } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";

export const paymentService = {
  // Get all payment requests
  async getPaymentRequests(): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as PaymentStatus,
      client: item.client ? {
        id: item.client.id,
        business_name: item.client.business_name,
        current_balance: item.client.balance
      } : undefined
    }));
  },

  // Get payment request by ID
  async getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client ? {
        id: data.client.id,
        business_name: data.client.business_name,
        current_balance: data.client.balance
      } : undefined
    } : null;
  },

  // Create payment request
  async createPaymentRequest(params: PaymentRequestParams): Promise<PaymentRequest> {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: params.client_id,
        amount: params.amount,
        pix_key_id: 'default-key', // Required field
        status: PaymentStatus.PENDING,
        notes: params.notes
      })
      .select(`
        *,
        client:clients(id, business_name, balance)
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client ? {
        id: data.client.id,
        business_name: data.client.business_name,
        current_balance: data.client.balance
      } : undefined
    };
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
        client:clients(id, business_name, balance)
      `)
      .single();

    if (error) throw error;
    return {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client ? {
        id: data.client.id,
        business_name: data.client.business_name,
        current_balance: data.client.balance
      } : undefined
    };
  },

  // Get payments by client
  async getPaymentsByClient(clientId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as PaymentStatus,
      client: item.client ? {
        id: item.client.id,
        business_name: item.client.business_name,
        current_balance: item.client.balance
      } : undefined
    }));
  },

  // Update payment request
  async updatePaymentRequest(id: string, updates: Partial<PaymentRequest>): Promise<PaymentRequest | null> {
    const updateData: any = { ...updates };
    if (updateData.status) {
      updateData.status = updateData.status;
    }

    const { data, error } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, business_name, balance)
      `)
      .single();

    if (error) throw error;
    return data ? {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client ? {
        id: data.client.id,
        business_name: data.client.business_name,
        current_balance: data.client.balance
      } : undefined
    } : null;
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
export const getClientPayments = paymentService.getPaymentsByClient; // Add the missing export
export const updatePaymentRequest = paymentService.updatePaymentRequest;
export const deletePaymentRequest = paymentService.deletePaymentRequest;
