import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentStatus, PaymentMethod, PaymentRequestParams, PaymentProcessParams, ClientBalance } from "@/types/payment.types";

export const getAllPaymentRequests = async (): Promise<PaymentRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:client_id (
          id,
          business_name,
          current_balance
        ),
        processor:processed_by (
          id,
          name
        )
      `)
      .order('requested_at', { ascending: false });

    if (error) {
      console.error('Error fetching payment requests:', error);
      throw new Error(`Erro ao buscar solicitações de pagamento: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllPaymentRequests:', error);
    throw error;
  }
};

export const updatePaymentStatus = async (paymentId: string, status: PaymentStatus, notes?: string, processedBy?: string): Promise<void> => {
  try {
    const updateData: any = {
      status,
      processed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (notes) updateData.notes = notes;
    if (processedBy) updateData.processed_by = processedBy;

    const { error } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', paymentId);

    if (error) {
      console.error('Error updating payment status:', error);
      throw new Error(`Erro ao atualizar status do pagamento: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updatePaymentStatus:', error);
    throw error;
  }
};

export const uploadPaymentReceipt = async (paymentId: string, file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `payment-${paymentId}-${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('payment-receipts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading receipt:', uploadError);
      throw new Error(`Erro ao fazer upload do comprovante: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('payment-receipts')
      .getPublicUrl(filePath);

    // Update payment request with receipt URL
    const { error: updateError } = await supabase
      .from('payment_requests')
      .update({ receipt_url: publicUrl })
      .eq('id', paymentId);

    if (updateError) {
      console.error('Error updating receipt URL:', updateError);
      throw new Error(`Erro ao salvar URL do comprovante: ${updateError.message}`);
    }

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPaymentReceipt:', error);
    throw error;
  }
};

export const createPaymentRequest = async (params: PaymentRequestParams): Promise<PaymentRequest> => {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: params.client_id,
        amount: params.amount,
        method: params.method,
        status: PaymentStatus.PROCESSING,
        requested_at: new Date().toISOString(),
        notes: params.notes
      })
      .select(`
        *,
        client:client_id (
          id,
          business_name,
          current_balance
        )
      `)
      .single();

    if (error) {
      console.error('Error creating payment request:', error);
      throw new Error(`Erro ao criar solicitação de pagamento: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createPaymentRequest:', error);
    throw error;
  }
};

export const getClientBalance = async (clientId: string): Promise<ClientBalance> => {
  try {
    // Get client basic info
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, current_balance, commission_rate')
      .eq('id', clientId)
      .single();

    if (clientError) {
      console.error('Error fetching client:', clientError);
      throw new Error(`Erro ao buscar dados do cliente: ${clientError.message}`);
    }

    // Get pending payments
    const { data: pendingPayments, error: paymentsError } = await supabase
      .from('payment_requests')
      .select('amount')
      .eq('client_id', clientId)
      .eq('status', PaymentStatus.PROCESSING);

    if (paymentsError) {
      console.error('Error fetching pending payments:', paymentsError);
      throw new Error(`Erro ao buscar pagamentos pendentes: ${paymentsError.message}`);
    }

    // Get total sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('net_amount')
      .eq('client_id', clientId);

    if (salesError) {
      console.error('Error fetching sales:', salesError);
      throw new Error(`Erro ao buscar vendas: ${salesError.message}`);
    }

    const totalPendingPayments = pendingPayments?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
    const totalSales = sales?.reduce((sum, sale) => sum + sale.net_amount, 0) || 0;

    return {
      client_id: clientId,
      current_balance: client.current_balance || 0,
      pending_payments: totalPendingPayments,
      total_sales: totalSales,
      commission_rate: client.commission_rate || 0
    };
  } catch (error) {
    console.error('Error in getClientBalance:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
export const getAllPayments = async () => {
  return getAllPaymentRequests();
};

export const getPaymentsByStatus = async (status: PaymentStatus) => {
  const allPayments = await getAllPaymentRequests();
  return allPayments.filter(payment => payment.status === status);
};

export const getClientPayments = async (clientId: string) => {
  const allPayments = await getAllPaymentRequests();
  return allPayments.filter(payment => payment.client_id === clientId);
};
