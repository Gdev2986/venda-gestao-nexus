
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentStatus } from "@/types/payment.types";

// Get all payments
export const getAllPayments = async (): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        id, 
        amount,
        status,
        client_id,
        created_at,
        updated_at,
        approved_at,
        client:client_id (business_name, email, phone)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      status: item.status as PaymentStatus,
      client_id: item.client_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
      client: item.client ? {
        id: item.client_id,
        business_name: item.client.business_name,
        email: item.client.email,
        phone: item.client.phone
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Get payments by status
export const getPaymentsByStatus = async (status: PaymentStatus): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        id, 
        amount,
        status,
        client_id,
        created_at,
        updated_at,
        approved_at,
        client:client_id (business_name, email, phone)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      status: item.status as PaymentStatus,
      client_id: item.client_id,
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
      client: item.client ? {
        id: item.client_id,
        business_name: item.client.business_name,
        email: item.client.email,
        phone: item.client.phone
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching payments by status:", error);
    throw error;
  }
};

// Get client payments
export const getClientPayments = async (clientId: string): Promise<Payment[]> => {
  try {
    const { data, error } = await supabase
      .from("payment_requests")
      .select(`
        id, 
        amount,
        status,
        client_id,
        created_at,
        updated_at,
        approved_at,
        rejection_reason,
        receipt_url,
        description,
        pix_key:pix_key_id (
          id,
          key,
          type,
          name,
          owner_name
        ),
        client:client_id (business_name, email, phone)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      client_id: item.client_id,
      amount: item.amount,
      status: item.status as PaymentStatus,
      description: item.description || '',
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
      receipt_url: item.receipt_url,
      rejection_reason: item.rejection_reason,
      client: item.client ? {
        id: item.client_id,
        business_name: item.client.business_name,
        email: item.client.email,
        phone: item.client.phone
      } : undefined,
      pix_key: item.pix_key ? {
        id: item.pix_key.id,
        key: item.pix_key.key,
        type: item.pix_key.type,
        name: item.pix_key.name,
        owner_name: item.pix_key.owner_name || item.pix_key.name
      } : undefined
    }));
  } catch (error) {
    console.error("Error fetching client payments:", error);
    throw error;
  }
};
