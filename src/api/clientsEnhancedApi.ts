
import { supabase } from "@/integrations/supabase/client";
import { Client, Partner } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const fetchClients = async (page = 1, pageSize = 50): Promise<{clients: Client[], count: number}> => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Fetch clients with pagination
    const { data, error, count } = await supabase
      .from("clients")
      .select(`
        *,
        partner:partners(id, company_name),
        machines:machines(id),
        fee_plan:fee_plans(id, name)
      `, { count: 'exact' })
      .range(from, to);

    if (error) throw error;

    // Transform the data to match our Client type
    const enhancedClients = data.map(client => ({
      ...client,
      partner_name: client.partner?.company_name || null,
      machines_count: client.machines?.length || 0,
      fee_plan_name: client.fee_plan?.name || null
    })) as Client[];
    
    return { clients: enhancedClients, count: count || 0 };
  } catch (err) {
    console.error("Error fetching clients:", err);
    return { clients: [], count: 0 };
  }
};

export const fetchClientById = async (id: string): Promise<Client | null> => {
  try {
    const { data, error } = await supabase
      .from("clients")
      .select(`
        *,
        partner:partners(id, company_name),
        machines:machines(id, serial_number, status, model),
        fee_plan:fee_plans(id, name, description)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;

    // Transform the data to match our Client type
    return {
      ...data,
      partner_name: data.partner?.company_name || null,
      machines_count: data.machines?.length || 0,
      fee_plan_name: data.fee_plan?.name || null
    } as Client;
  } catch (err) {
    console.error("Error fetching client by ID:", err);
    return null;
  }
};

// Fetch partners for dropdown selection
export const fetchPartners = async (): Promise<Partner[]> => {
  try {
    const { data, error } = await supabase
      .from("partners")
      .select("*");
    
    if (error) throw error;
    
    return data as Partner[];
  } catch (err) {
    console.error("Error fetching partners:", err);
    return [];
  }
};

// Fetch fee plans for dropdown selection
export const fetchFeePlans = async () => {
  try {
    const { data, error } = await supabase
      .from("fee_plans")
      .select("*");
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error("Error fetching fee plans:", err);
    return [];
  }
};

// Create a new client
export const createClient = async (clientData: Partial<Client>): Promise<{success: boolean, client?: Client, error?: string}> => {
  try {
    const id = uuidv4();
    const newClient = {
      ...clientData,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'ACTIVE',
      balance: clientData.balance || 0
    };

    const { data, error } = await supabase
      .from("clients")
      .insert([newClient])
      .select();

    if (error) throw error;

    return { success: true, client: data[0] as Client };
  } catch (err: any) {
    console.error("Error creating client:", err);
    return { success: false, error: err.message };
  }
};

// Update an existing client
export const updateClient = async (id: string, clientData: Partial<Client>): Promise<{success: boolean, client?: Client, error?: string}> => {
  try {
    const updateData = {
      ...clientData,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from("clients")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) throw error;

    return { success: true, client: data[0] as Client };
  } catch (err: any) {
    console.error("Error updating client:", err);
    return { success: false, error: err.message };
  }
};

// Delete a client
export const deleteClient = async (id: string): Promise<{success: boolean, error?: string}> => {
  try {
    // First check if there are dependent records (machines, payments, etc)
    const { data: machines, error: machinesError } = await supabase
      .from("machines")
      .select("id")
      .eq("client_id", id);
      
    if (machinesError) throw machinesError;
    
    if (machines && machines.length > 0) {
      return { 
        success: false, 
        error: `Não é possível excluir o cliente pois existem ${machines.length} máquinas vinculadas. Remova as máquinas primeiro.` 
      };
    }
    
    // Delete the client if no dependencies
    const { error } = await supabase
      .from("clients")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting client:", err);
    return { success: false, error: err.message };
  }
};

// Log client changes (for sensitive data)
export const logClientChange = async (
  clientId: string, 
  actionType: string, 
  previousValue: any, 
  newValue: any,
  userId: string
): Promise<void> => {
  try {
    await supabase
      .from("client_logs")
      .insert([{
        client_id: clientId,
        action_type: actionType,
        previous_value: previousValue,
        new_value: newValue,
        changed_by: userId
      }]);
  } catch (err) {
    console.error("Error logging client change:", err);
  }
};
