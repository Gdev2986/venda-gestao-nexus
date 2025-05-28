
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentStatus } from "@/types/payment.types";

export const paymentService = {
  // Get all payment requests
  async getPaymentRequests(): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as PaymentStatus,
      client: item.client || { id: '', business_name: '' },
      pix_key: item.pix_key || { id: '', key: '', name: '' },
      processor: { id: 'system', name: 'Sistema' },
      rejection_reason: item.rejection_reason || ''
    }));
  },

  // Get payment requests by client
  async getPaymentRequestsByClient(clientId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as PaymentStatus,
      client: item.client || { id: '', business_name: '' },
      pix_key: item.pix_key || { id: '', key: '', name: '' },
      processor: { id: 'system', name: 'Sistema' },
      rejection_reason: item.rejection_reason || ''
    }));
  },

  // Get payment request by ID
  async getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, name)
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
      client: data.client || { id: '', business_name: '' },
      pix_key: data.pix_key || { id: '', key: '', name: '' },
      processor: { id: 'system', name: 'Sistema' },
      rejection_reason: data.rejection_reason || ''
    } : null;
  },

  // Create payment request
  async createPaymentRequest(request: Omit<PaymentRequest, 'id' | 'created_at' | 'updated_at' | 'client' | 'pix_key' | 'processor'>): Promise<PaymentRequest> {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: request.client_id,
        amount: request.amount,
        pix_key_id: request.pix_key_id,
        description: request.description,
        status: request.status as string
      })
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, name)
      `)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client || { id: '', business_name: '' },
      pix_key: data.pix_key || { id: '', key: '', name: '' },
      processor: { id: 'system', name: 'Sistema' },
      rejection_reason: data.rejection_reason || ''
    };
  },

  // Update payment request
  async updatePaymentRequest(id: string, updates: Partial<PaymentRequest>): Promise<PaymentRequest> {
    const updateData: any = {};
    
    if (updates.status !== undefined) updateData.status = updates.status as string;
    if (updates.approved_by !== undefined) updateData.approved_by = updates.approved_by;
    if (updates.approved_at !== undefined) updateData.approved_at = updates.approved_at;
    if (updates.receipt_url !== undefined) updateData.receipt_url = updates.receipt_url;
    if (updates.rejection_reason !== undefined) updateData.rejection_reason = updates.rejection_reason;

    const { data, error } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, name)
      `)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      status: data.status as PaymentStatus,
      client: data.client || { id: '', business_name: '' },
      pix_key: data.pix_key || { id: '', key: '', name: '' },
      processor: { id: 'system', name: 'Sistema' },
      rejection_reason: data.rejection_reason || ''
    };
  },

  // Delete payment request
  async deletePaymentRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Export individual functions for backward compatibility
export const getPaymentRequests = paymentService.getPaymentRequests;
export const getPaymentRequestsByClient = paymentService.getPaymentRequestsByClient;
export const getPaymentRequestById = paymentService.getPaymentRequestById;
export const createPaymentRequest = paymentService.createPaymentRequest;
export const updatePaymentRequest = paymentService.updatePaymentRequest;
export const deletePaymentRequest = paymentService.deletePaymentRequest;
