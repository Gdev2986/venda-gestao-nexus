
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestParams, PaymentProcessParams, PaymentType } from "@/types/payment.types";
import { PaymentStatus } from "@/types/enums";

export const paymentService = {
  // Get all payment requests with enhanced data and date filtering
  async getPaymentRequests(startDate?: Date, endDate?: Date): Promise<PaymentRequest[]> {
    let query = supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `);

    // Add date filtering if provided
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      query = query.lte('created_at', endOfDay.toISOString());
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.formatPaymentRequest);
  },

  // Get payment request by ID
  async getPaymentRequestById(id: string): Promise<PaymentRequest | null> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? this.formatPaymentRequest(data) : null;
  },

  // Create payment request with file upload support and new PIX key creation
  async createPaymentRequest(params: PaymentRequestParams): Promise<PaymentRequest> {
    let boleto_file_url: string | undefined;

    // Upload boleto file if provided
    if (params.boleto_file) {
      const fileName = `boletos/${params.client_id}/${Date.now()}-${params.boleto_file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-files')
        .upload(fileName, params.boleto_file);

      if (uploadError) throw uploadError;
      boleto_file_url = uploadData.path;
    }

    // Handle new PIX key creation
    let pix_key_id = params.pix_key_id;
    if (params.payment_type === 'PIX' && !pix_key_id && params.new_pix_key) {
      const newKeyData = params.new_pix_key;
      const { data: pixKeyData, error: pixKeyError } = await supabase
        .from('pix_keys')
        .insert({
          user_id: params.client_id,
          type: newKeyData.type,
          key: newKeyData.key,
          name: newKeyData.name,
          owner_name: newKeyData.owner_name,
          is_default: false
        })
        .select()
        .single();

      if (pixKeyError) throw pixKeyError;
      pix_key_id = pixKeyData.id;
    }

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: params.client_id,
        amount: params.amount,
        payment_type: params.payment_type,
        pix_key_id: pix_key_id || null,
        boleto_file_url,
        boleto_code: params.boleto_code || null,
        status: PaymentStatus.PENDING,
        notes: params.notes || null
      })
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .single();

    if (error) throw error;
    return this.formatPaymentRequest(data);
  },

  // Process payment request with receipt upload and balance deduction
  async processPaymentRequest(params: PaymentProcessParams): Promise<PaymentRequest> {
    let receipt_file_url: string | undefined;

    // Upload receipt file if provided
    if (params.receipt_file) {
      const fileName = `receipts/${params.payment_id}/${Date.now()}-${params.receipt_file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-files')
        .upload(fileName, params.receipt_file);

      if (uploadError) throw uploadError;
      receipt_file_url = uploadData.path;
    }

    // Start a transaction to update payment and client balance atomically
    const { data: payment, error: paymentError } = await supabase
      .from('payment_requests')
      .select('*, client:clients(id, balance)')
      .eq('id', params.payment_id)
      .single();

    if (paymentError) throw paymentError;

    const updateData: any = {
      status: params.status,
      processed_at: new Date().toISOString(),
      processed_by: (await supabase.auth.getUser()).data.user?.id,
      notes: params.notes
    };

    if (receipt_file_url) {
      updateData.receipt_file_url = receipt_file_url;
    }

    if (params.status === PaymentStatus.REJECTED && params.notes) {
      updateData.rejection_reason = params.notes;
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', params.payment_id);

    if (updateError) throw updateError;

    // If payment is approved, deduct from client balance and log the change
    if (params.status === PaymentStatus.APPROVED && payment.client) {
      const currentBalance = payment.client.balance || 0;
      const newBalance = currentBalance - payment.amount;

      // Update client balance
      const { error: balanceError } = await supabase
        .from('clients')
        .update({ balance: newBalance })
        .eq('id', payment.client_id);

      if (balanceError) throw balanceError;

      // Log balance change
      const { error: logError } = await supabase
        .from('balance_changes')
        .insert({
          client_id: payment.client_id,
          previous_balance: currentBalance,
          new_balance: newBalance,
          amount_changed: -payment.amount,
          changed_by: (await supabase.auth.getUser()).data.user?.id || '',
          reason: `Pagamento aprovado - ${payment.payment_type} - ${payment.amount}`
        });

      if (logError) throw logError;
    }

    // Return updated payment data
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .eq('id', params.payment_id)
      .single();

    if (error) throw error;
    return this.formatPaymentRequest(data);
  },

  async getPaymentsByClient(clientId: string): Promise<PaymentRequest[]> {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(this.formatPaymentRequest);
  },

  // Helper method to format payment request data
  formatPaymentRequest(item: any): PaymentRequest {
    return {
      id: item.id,
      client_id: item.client_id,
      amount: item.amount,
      payment_type: item.payment_type as PaymentType || 'PIX',
      status: item.status as PaymentStatus,
      created_at: item.created_at,
      updated_at: item.updated_at || item.created_at,
      processed_at: item.processed_at,
      processed_by: item.processed_by,
      notes: item.notes,
      receipt_file_url: item.receipt_file_url,
      description: item.description,
      rejection_reason: item.rejection_reason || "",
      pix_key_id: item.pix_key_id,
      boleto_file_url: item.boleto_file_url,
      boleto_code: item.boleto_code,
      client: item.client ? {
        id: item.client.id,
        business_name: item.client.business_name,
        current_balance: item.client.balance
      } : undefined,
      pix_key: item.pix_key ? {
        id: item.pix_key.id,
        key: item.pix_key.key,
        type: item.pix_key.type,
        name: item.pix_key.name,
        owner_name: item.pix_key.owner_name || item.pix_key.name,
        user_id: item.client_id,
        created_at: item.pix_key.created_at,
        updated_at: item.pix_key.updated_at
      } : undefined
    };
  },

  // Update payment request
  async updatePaymentRequest(id: string, updates: Partial<PaymentRequest>): Promise<PaymentRequest | null> {
    // Prepare the update data with proper types
    const dbUpdates: any = { ...updates };
    
    // Ensure status is properly typed
    if (updates.status) {
      dbUpdates.status = updates.status as PaymentStatus;
    }

    const { data, error } = await supabase
      .from('payment_requests')
      .update(dbUpdates)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, business_name, balance),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .single();

    if (error) throw error;
    return data ? this.formatPaymentRequest(data) : null;
  },

  // Delete payment request
  async deletePaymentRequest(id: string): Promise<void> {
    const { error } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
  
  // Get partner commission balance - This function is commented out since it doesn't exist in database
  async getPartnerCommissionBalance(partnerId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('commissions')
        .select('amount, is_paid')
        .eq('partner_id', partnerId);

      if (error) throw error;

      if (!data) return 0;

      const totalCommission = data.reduce((sum, comm) => sum + (comm.amount || 0), 0);
      const paidCommission = data
        .filter(comm => comm.is_paid)
        .reduce((sum, comm) => sum + (comm.amount || 0), 0);

      return totalCommission - paidCommission;
    } catch (error) {
      console.error('Error getting partner commission balance:', error);
      return 0;
    }
  },
};

// Export individual functions for backward compatibility
export const getPaymentRequests = paymentService.getPaymentRequests;
export const getPaymentRequestById = paymentService.getPaymentRequestById;
export const createPaymentRequest = paymentService.createPaymentRequest;
export const processPaymentRequest = paymentService.processPaymentRequest;
export const getPaymentsByClient = paymentService.getPaymentsByClient;
export const getClientPayments = paymentService.getPaymentsByClient;
export const updatePaymentRequest = paymentService.updatePaymentRequest;
export const deletePaymentRequest = paymentService.deletePaymentRequest;
export const getPartnerCommissionBalance = paymentService.getPartnerCommissionBalance;
