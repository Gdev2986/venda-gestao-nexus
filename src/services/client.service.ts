
import { supabase } from "@/integrations/supabase/client";

export interface Client {
  id: string;
  business_name: string;
  document?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const getAllClients = async (): Promise<Client[]> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('business_name', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllClients:', error);
    throw error;
  }
};

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getClientById:', error);
    throw error;
  }
};
