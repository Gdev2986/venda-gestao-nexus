import { supabase } from "@/integrations/supabase/client";
import { 
  Machine, 
  MachineStatus, 
  MachineStats, 
  MachineTransfer,
  MachineTransferParams,
  MachineCreateParams,
  MachineUpdateParams 
} from "@/types/machine.types";

// Get all machines
export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        id, 
        serial_number, 
        model, 
        status, 
        client_id,
        created_at, 
        updated_at,
        client:client_id (
          id, 
          business_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      serial_number: item.serial_number,
      model: item.model,
      status: item.status as MachineStatus,
      client_id: item.client_id,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      client: item.client,
    }));
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
};

// Alias for backward compatibility
export const getMachines = getAllMachines;

// Get machines by status
export const getMachinesByStatus = async (status: MachineStatus): Promise<Machine[]> => {
  try {
    const statusStr = status.toString();
    const { data, error } = await supabase
      .from("machines")
      .select(`
        id, 
        serial_number, 
        model, 
        status, 
        client_id,
        created_at, 
        updated_at,
        client:client_id (
          id, 
          business_name
        )
      `)
      .eq("status", statusStr as any)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data.map((item: any) => ({
      id: item.id,
      serial_number: item.serial_number,
      model: item.model,
      status: item.status as MachineStatus,
      client_id: item.client_id,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      client: item.client,
    }));
  } catch (error) {
    console.error("Error fetching machines by status:", error);
    throw error;
  }
};

// Get machine statistics
export const getMachineStats = async (): Promise<MachineStats> => {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select("id, status");

    if (error) throw error;

    const stats: MachineStats = {
      total: data.length,
      active: 0,
      inactive: 0,
      maintenance: 0,
      blocked: 0,
      stock: 0,
      transit: 0,
      byStatus: {},
      byClient: {},
      byModel: {}
    };

    // Calculate statistics
    data.forEach((machine) => {
      const status = machine.status as MachineStatus;
      
      // Update status counts
      if (status === MachineStatus.ACTIVE) stats.active++;
      else if (status === MachineStatus.INACTIVE) stats.inactive++;
      else if (status === MachineStatus.MAINTENANCE) stats.maintenance++;
      else if (status === MachineStatus.BLOCKED) stats.blocked++;
      else if (status === MachineStatus.STOCK) stats.stock++;
      else if (status === MachineStatus.TRANSIT) stats.transit++;
      
      // Update byStatus
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error("Error getting machine statistics:", error);
    throw error;
  }
};

// Create a new machine
export const createMachine = async (params: MachineCreateParams): Promise<Machine> => {
  try {
    const statusStr = params.status ? params.status.toString() : MachineStatus.STOCK.toString();
    
    // Remove notes from the data being sent to Supabase since the column doesn't exist
    const { notes, ...machineData } = params;
    
    const { data, error } = await supabase
      .from("machines")
      .insert({
        serial_number: machineData.serial_number,
        model: machineData.model,
        status: statusStr as any,
        client_id: machineData.client_id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      serial_number: data.serial_number,
      model: data.model,
      status: data.status as MachineStatus,
      client_id: data.client_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error creating machine:", error);
    throw error;
  }
};

// Update a machine
export const updateMachine = async (id: string, params: MachineUpdateParams): Promise<Machine> => {
  try {
    const updateData: any = {};
    
    if (params.serial_number !== undefined) updateData.serial_number = params.serial_number;
    if (params.model !== undefined) updateData.model = params.model;
    if (params.status !== undefined) updateData.status = params.status.toString();
    if (params.client_id !== undefined) updateData.client_id = params.client_id;
    // Remove notes from the update data since the column doesn't exist
    
    const { data, error } = await supabase
      .from("machines")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      serial_number: data.serial_number,
      model: data.model,
      status: data.status as MachineStatus,
      client_id: data.client_id,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  } catch (error) {
    console.error("Error updating machine:", error);
    throw error;
  }
};

// Delete a machine
export const deleteMachine = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("machines")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting machine:", error);
    throw error;
  }
};

// Transfer a machine between clients
export const transferMachine = async (params: MachineTransferParams): Promise<MachineTransfer> => {
  try {
    // Create a transfer record
    const { data: transferData, error: transferError } = await supabase
      .from("machine_transfers")
      .insert({
        machine_id: params.machine_id,
        from_client_id: params.from_client_id,
        to_client_id: params.to_client_id,
        transfer_date: new Date().toISOString(),
        cutoff_date: params.cutoff_date,
        created_by: params.created_by || "system"
      })
      .select(`
        id,
        machine_id,
        from_client_id,
        to_client_id,
        transfer_date,
        cutoff_date,
        created_at,
        created_by,
        machine:machine_id (id, serial_number, model, status),
        from_client:from_client_id (id, business_name),
        to_client:to_client_id (id, business_name)
      `)
      .single();

    if (transferError) throw transferError;

    // Update the machine's client_id
    const newStatusStr = params.to_client_id 
      ? MachineStatus.ACTIVE.toString()
      : MachineStatus.STOCK.toString();
      
    const { error: machineError } = await supabase
      .from("machines")
      .update({ 
        client_id: params.to_client_id,
        status: newStatusStr as any
      })
      .eq("id", params.machine_id);

    if (machineError) throw machineError;

    const transfer = transferData as unknown as MachineTransfer;
    return transfer;
  } catch (error) {
    console.error("Error transferring machine:", error);
    throw error;
  }
};

// Get machine transfer history
export const getMachineTransfers = async (machineId: string): Promise<MachineTransfer[]> => {
  try {
    const { data, error } = await supabase
      .from("machine_transfers")
      .select(`
        id,
        machine_id,
        from_client_id,
        to_client_id,
        transfer_date,
        cutoff_date,
        created_at,
        created_by,
        machine:machine_id (id, serial_number, model, status),
        from_client:from_client_id (id, business_name),
        to_client:to_client_id (id, business_name)
      `)
      .eq("machine_id", machineId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const transfers = data as unknown as MachineTransfer[];
    return transfers;
  } catch (error) {
    console.error("Error fetching machine transfers:", error);
    throw error;
  }
};

// Get clients with machines
export const getClientsWithMachines = async (): Promise<any[]> => {
  try {
    const { data: machines, error } = await supabase
      .from("machines")
      .select(`
        id,
        status,
        client:client_id (
          id,
          business_name
        )
      `)
      .not('client_id', 'is', null);

    if (error) throw error;

    // Group machines by client
    const clientsMap = machines.reduce((acc: Record<string, any>, machine: any) => {
      if (!machine.client) return acc;
      
      const clientId = machine.client.id;
      
      if (!acc[clientId]) {
        acc[clientId] = {
          id: clientId,
          business_name: machine.client.business_name,
          machineCount: 0,
          machines: []
        };
      }
      
      acc[clientId].machineCount += 1;
      acc[clientId].machines.push({
        id: machine.id,
        status: machine.status
      });
      
      return acc;
    }, {});

    return Object.values(clientsMap);
  } catch (error) {
    console.error("Error fetching clients with machines:", error);
    throw error;
  }
};
