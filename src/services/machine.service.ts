
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineCreateParams, MachineStats, MachineStatus, MachineTransferParams, MachineUpdateParams } from "@/types/machine.types";
import { PostgrestFilterBuilder } from "@supabase/supabase-js";

const supabaseDbStatusValues = {
  [MachineStatus.ACTIVE]: "ACTIVE",
  [MachineStatus.INACTIVE]: "INACTIVE",
  [MachineStatus.MAINTENANCE]: "MAINTENANCE",
  [MachineStatus.BLOCKED]: "BLOCKED",
  [MachineStatus.STOCK]: "STOCK",
  [MachineStatus.TRANSIT]: "TRANSIT",
};

// Convert MachineStatus to database string representation
const statusToDbValue = (status: MachineStatus): string => {
  return supabaseDbStatusValues[status] || "ACTIVE";
};

// Convert database string to MachineStatus
const dbValueToStatus = (value: string): MachineStatus => {
  const entries = Object.entries(supabaseDbStatusValues);
  const found = entries.find(([_, dbValue]) => dbValue === value);
  return found ? found[0] as MachineStatus : MachineStatus.ACTIVE;
};

/**
 * Retrieves all machines from the database
 */
export async function getAllMachines(): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Convert database status to enum
    return data.map(item => ({
      ...item,
      status: dbValueToStatus(item.status)
    }));
  } catch (error) {
    console.error('Error fetching all machines:', error);
    throw error;
  }
}

/**
 * Retrieves machines by status
 * @param status Machine status filter
 */
export async function getMachinesByStatus(status: MachineStatus): Promise<Machine[]> {
  try {
    const dbStatus = statusToDbValue(status);
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('status', dbStatus)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      status: dbValueToStatus(item.status)
    }));
  } catch (error) {
    console.error(`Error fetching machines with status ${status}:`, error);
    throw error;
  }
}

/**
 * Retrieves machines for a specific client
 * @param clientId Client ID
 */
export async function getMachinesByClientId(clientId: string): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      status: dbValueToStatus(item.status)
    }));
  } catch (error) {
    console.error(`Error fetching machines for client ${clientId}:`, error);
    throw error;
  }
}

/**
 * Creates a new machine record
 * @param params Machine creation parameters
 */
export async function createMachine(params: MachineCreateParams): Promise<Machine> {
  try {
    const dbStatus = statusToDbValue(params.status);
    const { data, error } = await supabase
      .from('machines')
      .insert({
        serial_number: params.serial_number,
        model: params.model,
        status: dbStatus,
        client_id: params.client_id
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      status: dbValueToStatus(data.status)
    };
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error;
  }
}

/**
 * Updates an existing machine
 * @param id Machine ID
 * @param params Machine update parameters
 */
export async function updateMachine(id: string, params: MachineUpdateParams): Promise<Machine> {
  try {
    const updates: any = {};
    
    if (params.serial_number) updates.serial_number = params.serial_number;
    if (params.model) updates.model = params.model;
    if (params.client_id !== undefined) updates.client_id = params.client_id;
    if (params.status) updates.status = statusToDbValue(params.status);

    const { data, error } = await supabase
      .from('machines')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return {
      ...data,
      status: dbValueToStatus(data.status)
    };
  } catch (error) {
    console.error(`Error updating machine ${id}:`, error);
    throw error;
  }
}

/**
 * Transfers a machine from one client to another
 * @param params Machine transfer parameters
 */
export async function transferMachine(params: MachineTransferParams): Promise<void> {
  try {
    // First, create a transfer record
    const { error: transferError } = await supabase
      .from('machine_transfers')
      .insert({
        machine_id: params.machine_id,
        from_client_id: params.from_client_id,
        to_client_id: params.to_client_id,
        transfer_date: params.transfer_date || new Date().toISOString(),
        created_by: params.created_by
      });

    if (transferError) {
      throw transferError;
    }

    // Then update the machine client_id
    const { error: updateError } = await supabase
      .from('machines')
      .update({ 
        client_id: params.to_client_id,
        status: statusToDbValue(params.from_client_id ? MachineStatus.ACTIVE : MachineStatus.STOCK)
      })
      .eq('id', params.machine_id);

    if (updateError) {
      throw updateError;
    }

    // Call a Supabase function to handle additional logic if needed
    try {
      await supabase.rpc("get_user_role", {
        user_id: params.created_by
      });
    } catch (rpcError) {
      console.error('RPC error (non-critical):', rpcError);
      // Continue execution even if RPC fails
    }
    
  } catch (error) {
    console.error('Error transferring machine:', error);
    throw error;
  }
}

/**
 * Gets machine statistics
 */
export async function getMachineStats(): Promise<MachineStats> {
  try {
    const { data: allMachines, error } = await supabase
      .from('machines')
      .select('id, status, client_id');

    if (error) {
      throw error;
    }

    const total = allMachines.length;
    const stock = allMachines.filter(m => m.status === statusToDbValue(MachineStatus.STOCK)).length;
    const withClients = allMachines.filter(m => m.client_id).length;
    
    // Count by status
    const byStatus: Record<string, number> = {};
    allMachines.forEach(machine => {
      const status = machine.status;
      byStatus[status] = (byStatus[status] || 0) + 1;
    });

    return {
      total,
      stock,
      withClients,
      byStatus
    };
  } catch (error) {
    console.error('Error getting machine statistics:', error);
    throw error;
  }
}

// Helper function to fetch machines for various components
export const fetchMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(item => ({
      ...item,
      status: dbValueToStatus(item.status)
    }));
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};
