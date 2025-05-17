
import { supabase } from "@/integrations/supabase/client";

interface RequestPixPaymentParams {
  paymentId: string;
  amount: number;
  description?: string;
  clientId: string;
}

export async function requestPixPayment(params: RequestPixPaymentParams) {
  try {
    // In a real implementation, this would make an API call to a payment processor
    // Here we'll just update the payment request status
    
    const { error } = await supabase
      .from('payment_requests')
      .update({
        description: params.description || "Depósito via PIX"
      })
      .eq('id', params.paymentId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error requesting PIX payment:", error);
    return { 
      success: false, 
      error: error.message || "Falha ao processar solicitação de pagamento" 
    };
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        id,
        amount,
        description,
        status,
        pix_key_id,
        created_at,
        updated_at,
        approved_at,
        approved_by,
        receipt_url,
        rejection_reason,
        client_id,
        pix_key:pix_keys (
          id, 
          key,
          type,
          name,
          owner_name
        )
      `)
      .eq('id', paymentId)
      .single();
    
    if (error) throw error;
    
    return { success: true, payment: data };
  } catch (error: any) {
    console.error("Error fetching payment:", error);
    return { success: false, error: error.message };
  }
}
