
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentRequest, PaymentStatus } from "@/types/payment.types";

// Function to get user's payment requests
export async function getUserPaymentRequests(userId: string): Promise<PaymentRequest[]> {
  try {
    // Get client IDs for this user
    const { data: clientIds, error: clientsError } = await supabase
      .from("user_client_access")
      .select("client_id")
      .eq("user_id", userId);

    if (clientsError) {
      console.error("Error getting client IDs:", clientsError);
      return [];
    }

    if (!clientIds || clientIds.length === 0) {
      return [];
    }

    // Fetch payment requests for these clients
    const { data: payments, error: paymentsError } = await supabase
      .from("payment_requests")
      .select(`
        *,
        client:clients(id, business_name, email),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .in("client_id", clientIds.map(item => item.client_id));

    if (paymentsError) {
      console.error("Error getting payment requests:", paymentsError);
      return [];
    }

    return payments as PaymentRequest[];
  } catch (error) {
    console.error("Error in getUserPaymentRequests:", error);
    return [];
  }
}

// Function to get all payment requests (for admin/financial)
export async function getAllPaymentRequests(status?: PaymentStatus): Promise<Payment[]> {
  try {
    let query = supabase
      .from("payment_requests")
      .select(`
        *,
        client:clients(id, business_name, email),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error getting all payment requests:", error);
      return [];
    }

    // Map to the Payment interface
    const payments: Payment[] = data.map((item: any) => {
      return {
        id: item.id,
        client_id: item.client_id,
        client: item.client,
        client_name: item.client?.business_name || 'Unknown',
        amount: item.amount,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        approved_at: item.approved_at,
        approved_by: item.approved_by,
        receipt_url: item.receipt_url,
        description: item.description,
        rejection_reason: item.rejection_reason,
        payment_type: item.payment_type,
        pix_key_id: item.pix_key_id,
        pix_key: item.pix_key
      };
    });

    return payments;
  } catch (error) {
    console.error("Error in getAllPaymentRequests:", error);
    return [];
  }
}

// Function to approve a payment request
export async function approvePaymentRequest(
  paymentId: string, 
  adminId: string
): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .update({
        status: "APPROVED",
        approved_by: adminId,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select(`
        *,
        client:clients(id, business_name, email),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .single();

    if (error) {
      console.error("Error approving payment:", error);
      return null;
    }

    // Map to Payment interface
    const payment: Payment = {
      id: data.id,
      client_id: data.client_id,
      client: data.client,
      client_name: data.client?.business_name || 'Unknown',
      amount: data.amount,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      approved_at: data.approved_at,
      approved_by: data.approved_by,
      receipt_url: data.receipt_url,
      description: data.description,
      rejection_reason: data.rejection_reason,
      payment_type: data.payment_type,
      pix_key_id: data.pix_key_id,
      pix_key: data.pix_key
    };

    return payment;
  } catch (error) {
    console.error("Error in approvePaymentRequest:", error);
    return null;
  }
}

// Function to reject a payment request
export async function rejectPaymentRequest(
  paymentId: string,
  reason: string
): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .update({
        status: "REJECTED",
        rejection_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select(`
        *,
        client:clients(id, business_name, email),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .single();

    if (error) {
      console.error("Error rejecting payment:", error);
      return null;
    }

    // Map to Payment interface
    const payment: Payment = {
      id: data.id,
      client_id: data.client_id,
      client: data.client,
      client_name: data.client?.business_name || 'Unknown',
      amount: data.amount,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      approved_at: data.approved_at,
      approved_by: data.approved_by,
      receipt_url: data.receipt_url,
      description: data.description,
      rejection_reason: data.rejection_reason,
      payment_type: data.payment_type,
      pix_key_id: data.pix_key_id,
      pix_key: data.pix_key
    };

    return payment;
  } catch (error) {
    console.error("Error in rejectPaymentRequest:", error);
    return null;
  }
}

// Function to upload payment receipt
export async function uploadPaymentReceipt(
  paymentId: string,
  receiptUrl: string
): Promise<Payment | null> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .update({
        receipt_url: receiptUrl,
        updated_at: new Date().toISOString()
      })
      .eq("id", paymentId)
      .select(`
        *,
        client:clients(id, business_name, email),
        pix_key:pix_keys(id, key, type, name, owner_name)
      `)
      .single();

    if (error) {
      console.error("Error uploading receipt:", error);
      return null;
    }

    // Map to Payment interface
    const payment: Payment = {
      id: data.id,
      client_id: data.client_id,
      client: data.client,
      client_name: data.client?.business_name || 'Unknown',
      amount: data.amount,
      status: data.status,
      created_at: data.created_at,
      updated_at: data.updated_at,
      approved_at: data.approved_at,
      approved_by: data.approved_by,
      receipt_url: data.receipt_url,
      description: data.description,
      rejection_reason: data.rejection_reason,
      payment_type: data.payment_type,
      pix_key_id: data.pix_key_id,
      pix_key: data.pix_key
    };

    return payment;
  } catch (error) {
    console.error("Error in uploadPaymentReceipt:", error);
    return null;
  }
}
