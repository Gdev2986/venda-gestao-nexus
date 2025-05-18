
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentRequest, PaymentStatus } from "@/types/payment.types";

interface GetPaymentsParams {
  clientId?: string;
  status?: PaymentStatus;
  limit?: number;
}

export async function getPayments({
  clientId,
  status,
  limit = 100,
}: GetPaymentsParams = {}) {
  try {
    // Build query
    let query = supabase
      .from("payment_requests")
      .select(`
        *,
        pix_key:pix_keys(*)
      `)
      .order("created_at", { ascending: false })
      .limit(limit);

    // Apply filters if provided
    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    if (status) {
      query = query.eq("status", status as string);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}

export async function createPaymentRequest(payment: Omit<PaymentRequest, "id" | "created_at" | "status" | "updated_at" | "approved_at" | "approved_by" | "receipt_url" | "rejection_reason">) {
  try {
    const { data, error } = await supabase.from("payment_requests").insert({
      client_id: payment.client_id,
      amount: payment.amount,
      pix_key_id: payment.pix_key?.id,
      description: payment.description,
      status: "PENDING",
    }).select().single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating payment request:", error);
    throw error;
  }
}

export async function approvePayment(paymentId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .update({
        status: "APPROVED", // Use string literal instead of enum
        approved_by: userId,
        approved_at: new Date().toISOString(),
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error approving payment:", error);
    throw error;
  }
}

export async function rejectPayment(
  paymentId: string,
  rejectionReason: string
) {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .update({
        status: "REJECTED", // Use string literal instead of enum
        rejection_reason: rejectionReason,
      })
      .eq("id", paymentId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error rejecting payment:", error);
    throw error;
  }
}

export async function getPaymentById(paymentId: string): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        *,
        pix_key:pix_keys(*)
      `)
      .eq("id", paymentId)
      .single();

    if (error) {
      throw error;
    }

    // Transform to Payment type with proper structure
    const payment: Payment = {
      ...data,
      description: data.description || "",
      rejection_reason: data.rejection_reason || null,
      pix_key: data.pix_key ? {
        id: data.pix_key.id,
        key: data.pix_key.key,
        type: data.pix_key.type,
        name: data.pix_key.name || '',
        owner_name: data.pix_key.name || ''
      } : undefined
    };

    return payment;
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error;
  }
}

export async function getClientPayments(clientId: string): Promise<Payment[]> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        *,
        pix_key:pix_keys(*)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map((payment) => ({
      ...payment,
      description: payment.description || "",
      rejection_reason: payment.rejection_reason || null,
      pix_key: payment.pix_key ? {
        id: payment.pix_key.id,
        key: payment.pix_key.key,
        type: payment.pix_key.type,
        name: payment.pix_key.name || '',
        owner_name: payment.pix_key.name || ''
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching client payments:", error);
    throw error;
  }
}

export async function createPixPaymentRequest(pixPayment: {
  client_id: string;
  amount: number;
  pix_key_id: string;
  description?: string;
}): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        client_id: pixPayment.client_id,
        amount: pixPayment.amount,
        pix_key_id: pixPayment.pix_key_id,
        description: pixPayment.description,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating PIX payment request:", error);
    throw error;
  }
}

export async function createBoletoPaymentRequest(boletoPayment: {
  client_id: string;
  amount: number;
  description?: string;
  due_date: string;
  pix_key_id?: string;
}): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        client_id: boletoPayment.client_id,
        amount: boletoPayment.amount,
        pix_key_id: boletoPayment.pix_key_id,
        description: boletoPayment.description,
        due_date: boletoPayment.due_date,
        payment_type: "BOLETO",
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating boleto payment request:", error);
    throw error;
  }
}

export async function createTedPaymentRequest(tedPayment: {
  client_id: string;
  amount: number;
  description?: string;
  due_date: string;
  pix_key_id?: string;
  notes?: string;
}): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .insert({
        client_id: tedPayment.client_id,
        amount: tedPayment.amount,
        pix_key_id: tedPayment.pix_key_id,
        description: tedPayment.description,
        due_date: tedPayment.due_date,
        notes: tedPayment.notes,
        payment_type: "TED",
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error creating TED payment request:", error);
    throw error;
  }
}
