
import { supabase } from "@/integrations/supabase/client";

// Define types for payments
export interface Payment {
  id: string;
  amount: number;
  status: string;
  client_id?: string;
  client_name?: string;
  created_at: string;
  updated_at?: string;
  approved_at?: string;
}

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
        client:client_id (business_name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      status: item.status,
      client_id: item.client_id,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
    }));
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

// Get payments by status
export const getPaymentsByStatus = async (status: string): Promise<Payment[]> => {
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
        client:client_id (business_name)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      status: item.status,
      client_id: item.client_id,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
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
        client:client_id (business_name)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      amount: item.amount,
      status: item.status,
      client_id: item.client_id,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      approved_at: item.approved_at,
    }));
  } catch (error) {
    console.error("Error fetching client payments:", error);
    throw error;
  }
};
