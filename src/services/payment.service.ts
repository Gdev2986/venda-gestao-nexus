
import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestStatus } from "@/types/payment.types";

export async function getPaymentRequests() {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name),
        pix_key:pix_keys(id, key, key_type)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching payment requests:', error);
    throw error;
  }
}

export async function getPaymentRequestById(id: string) {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        client:clients(id, business_name, email, document),
        pix_key:pix_keys(id, key, key_type)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return formatPaymentRequest(data);
  } catch (error) {
    console.error('Error fetching payment request:', error);
    throw error;
  }
}

export async function createPaymentRequest(paymentData: Omit<PaymentRequest, 'id' | 'created_at' | 'updated_at' | 'status' | 'approved_at' | 'approved_by' | 'receipt_url' | 'rejection_reason'>) {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        client_id: paymentData.client_id,
        amount: paymentData.amount,
        description: paymentData.description,
        pix_key_id: paymentData.pix_key_id,
        status: 'PENDING' as PaymentRequestStatus
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating payment request:', error);
    throw error;
  }
}

export async function approvePaymentRequest(id: string, approvedBy: string, receiptUrl?: string) {
  try {
    const updateData: any = {
      status: 'APPROVED' as PaymentRequestStatus,
      approved_at: new Date().toISOString(),
      approved_by: approvedBy
    };
    
    if (receiptUrl) {
      updateData.receipt_url = receiptUrl;
    }
    
    const { data, error } = await supabase
      .from('payment_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error approving payment request:', error);
    throw error;
  }
}

export async function rejectPaymentRequest(id: string, rejectionReason: string) {
  try {
    const { data, error } = await supabase
      .from('payment_requests')
      .update({
        status: 'REJECTED' as PaymentRequestStatus,
        rejection_reason: rejectionReason
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error rejecting payment request:', error);
    throw error;
  }
}

export function formatPaymentRequest(paymentRequest: any): PaymentRequest {
  return {
    id: paymentRequest.id,
    client_id: paymentRequest.client_id,
    amount: paymentRequest.amount,
    description: paymentRequest.description || "",
    status: paymentRequest.status,
    created_at: paymentRequest.created_at,
    updated_at: paymentRequest.updated_at,
    receipt_url: paymentRequest.receipt_url || null,
    pix_key_id: paymentRequest.pix_key_id,
    approved_at: paymentRequest.approved_at || null,
    approved_by: paymentRequest.approved_by || null,
    rejection_reason: paymentRequest.rejection_reason || null,
    client: paymentRequest.client,
    pix_key: paymentRequest.pix_key
  };
}

export async function getMockPaymentRequests() {
  // Get current date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  // Mock data for payment requests
  const mockRequests: PaymentRequest[] = [
    {
      id: "pr_001",
      client_id: "cl_001",
      amount: 1500,
      description: "Invoice #0001",
      status: "PENDING",
      created_at: today.toISOString(),
      updated_at: today.toISOString(),
      approved_at: null,
      approved_by: null,
      receipt_url: null,
      pix_key_id: "pk_001",
      rejection_reason: null,
      client: {
        id: "cl_001",
        business_name: "Empresa ABC Ltda",
        document: "12.345.678/0001-90",
        email: "financeiro@empresaabc.com"
      }
    },
    {
      id: "pr_002",
      client_id: "cl_002",
      amount: 2750,
      description: "Invoice #0002",
      status: "APPROVED",
      created_at: yesterday.toISOString(),
      updated_at: today.toISOString(),
      approved_at: today.toISOString(),
      approved_by: "usr_001",
      receipt_url: "https://example.com/receipts/0002.pdf",
      pix_key_id: "pk_002",
      rejection_reason: null,
      client: {
        id: "cl_002",
        business_name: "XYZ Consultoria",
        document: "98.765.432/0001-21",
        email: "pagamentos@xyz.com"
      }
    },
    {
      id: "pr_003",
      client_id: "cl_003",
      amount: 950,
      description: "Invoice #0003",
      status: "REJECTED",
      created_at: lastWeek.toISOString(),
      updated_at: yesterday.toISOString(),
      approved_at: null,
      approved_by: null,
      receipt_url: null,
      pix_key_id: "pk_003",
      rejection_reason: "Valor incorreto, favor revisar",
      client: {
        id: "cl_003",
        business_name: "Tech Solutions SA",
        document: "45.678.901/0001-32",
        email: "financeiro@techsolutions.com"
      }
    }
  ];
  
  return mockRequests;
}
