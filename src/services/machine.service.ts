
import { supabase } from "@/integrations/supabase/client";
import { 
  Machine, 
  MachineCreateParams, 
  MachineUpdateParams,
  MachineStatus,
  MachineTransferParams,
  MachineStats
} from "@/types/machine.types";

/**
 * Fetch all machines
 */
export const fetchMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
};

/**
 * Fetch machines by status
 */
export const fetchMachinesByStatus = async (status: string | MachineStatus): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching machines with status ${status}:`, error);
    throw error;
  }
};

/**
 * Fetch machines by client
 */
export const fetchMachinesByClient = async (clientId: string): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching machines for client ${clientId}:`, error);
    throw error;
  }
};

/**
 * Create a new machine
 */
export const createMachine = async (machine: MachineCreateParams): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .insert({
        serial_number: machine.serial_number,
        model: machine.model,
        status: machine.status,
        client_id: machine.client_id || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating machine:", error);
    throw error;
  }
};

/**
 * Update a machine
 */
export const updateMachine = async (
  machineId: string,
  updates: MachineUpdateParams
): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .update(updates)
      .eq("id", machineId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error updating machine ${machineId}:`, error);
    throw error;
  }
};

/**
 * Delete a machine
 */
export const deleteMachine = async (machineId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("machines")
      .delete()
      .eq("id", machineId);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting machine ${machineId}:`, error);
    throw error;
  }
};

/**
 * Transfer machine between clients
 */
export const transferMachine = async (params: MachineTransferParams): Promise<void> => {
  try {
    // First, update the machine client_id
    const { error: updateError } = await supabase
      .from("machines")
      .update({ 
        client_id: params.to_client_id,
        status: params.to_client_id ? MachineStatus.ACTIVE : MachineStatus.STOCK
      })
      .eq("id", params.machine_id);

    if (updateError) throw updateError;

    // Log the transfer
    const { error: logError } = await supabase
      .from("machine_transfers")
      .insert({
        machine_id: params.machine_id,
        from_client_id: params.from_client_id,
        to_client_id: params.to_client_id,
        transfer_date: params.transfer_date || new Date().toISOString(),
        created_by: params.created_by
      });

    if (logError) throw logError;
  } catch (error) {
    console.error(`Error transferring machine ${params.machine_id}:`, error);
    throw error;
  }
};

/**
 * Get machine statistics
 */
export const getMachineStats = async (): Promise<MachineStats> => {
  try {
    // Get total machines
    const { count: total, error: totalError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true });

    if (totalError) throw totalError;

    // Get machines in stock
    const { count: stock, error: stockError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true })
      .eq("status", MachineStatus.STOCK.toString());

    if (stockError) throw stockError;

    // Get machines with clients
    const { count: withClients, error: clientsError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true })
      .not("client_id", "is", null);

    if (clientsError) throw clientsError;

    // Get machines by status
    const { data: statusCounts, error: statusError } = await supabase
      .from("machines")
      .select("status")
      .not("status", "is", null);

    if (statusError) throw statusError;

    // Count machines by status
    const byStatus: Record<string, number> = {};
    statusCounts.forEach((machine) => {
      const status = machine.status as string;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total: total || 0,
      stock: stock || 0,
      withClients: withClients || 0,
      byStatus
    };
  } catch (error) {
    console.error("Error getting machine statistics:", error);
    throw error;
  }
};
