import { supabase } from "@/integrations/supabase/client";
import { PaymentRequest, PaymentRequestStatus } from "@/types/payment.types";

export const createPaymentRequest = async (
  clientId: string,
  amount: number,
  pixKeyId: string,
  description: string
): Promise<{ success: boolean; error?: string; data?: any }> => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        client_id: clientId,
        amount,
        pix_key_id: pixKeyId,
        description,
        status: "PENDING" as PaymentRequestStatus,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating payment request:", error);
    return { success: false, error: error.message };
  }
};

export const uploadPaymentReceipt = async (
  paymentId: string,
  file: File
): Promise<{ success: boolean; error?: string; url?: string }> => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${paymentId}.${fileExt}`;
    const filePath = `payment-receipts/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from("receipts")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("receipts")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update payment record with receipt URL
    const { error: updateError } = await supabase
      .from("payment_requests")
      .update({ receipt_url: publicUrl })
      .eq("id", paymentId);

    if (updateError) throw updateError;

    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Error uploading receipt:", error);
    return { success: false, error: error.message };
  }
};

export const fetchPaymentRequests = async (
  clientId?: string
): Promise<{
  data: PaymentRequest[] | null;
  error: string | null;
}> => {
  try {
    let query = supabase
      .from("payment_requests")
      .select("*, client:clients(id, business_name)");

    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    // Transform the data to match the PaymentRequest interface
    const formattedRequests = data.map((request) => ({
      id: request.id,
      client_id: request.client_id,
      client_name: request.client?.business_name || "Unknown Client",
      amount: request.amount,
      description: request.description || "",
      status: request.status as PaymentRequestStatus,
      created_at: request.created_at,
      updated_at: request.updated_at,
      receipt_url: request.receipt_url || null,
      pix_key_id: request.pix_key_id,
    }));

    return { data: formattedRequests, error: null };
  } catch (error: any) {
    console.error("Error fetching payment requests:", error);
    return { data: null, error: error.message };
  }
};

// Fix the missing payments table by using payment_requests instead
export const fetchPayments = async () => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select("*");

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

export const getPaymentDetails = async (paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

// Add the missing formatPaymentRequest function
export const formatPaymentRequest = (request: any): PaymentRequest => {
  return {
    id: request.id,
    client_id: request.client_id,
    amount: request.amount,
    description: request.description || "",
    status: request.status as PaymentRequestStatus,
    pix_key_id: request.pix_key_id,
    created_at: request.created_at,
    updated_at: request.updated_at,
    approved_at: request.approved_at || null,
    approved_by: request.approved_by || null,
    receipt_url: request.receipt_url || null,
    rejection_reason: request.rejection_reason || null,
    pix_key: request.pix_key ? {
      id: request.pix_key.id,
      key: request.pix_key.key,
      key_type: request.pix_key.type,
      type: request.pix_key.type,
      name: request.pix_key.name
    } : undefined,
    client: request.client ? {
      id: request.client.id,
      business_name: request.client.business_name,
      document: request.client?.document,
      email: request.client?.email
    } : undefined
  };
};
