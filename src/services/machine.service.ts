import { supabase } from "@/integrations/supabase/client";
import { 
  Machine, 
  MachineStatus, 
  MachineCreateParams, 
  MachineUpdateParams, 
  MachineTransferParams,
  MachineStats
} from "@/types/machine.types";

export async function getAllMachines(): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Machine[];
  } catch (error) {
    console.error("Error fetching machines:", error);
    throw error;
  }
}

export async function getMachinesByStatus(status: MachineStatus | string): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq("status", status) // Converted to string automatically
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Machine[];
  } catch (error) {
    console.error(`Error fetching machines with status ${status}:`, error);
    throw error;
  }
}

export async function getMachineById(id: string): Promise<Machine> {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    return data as Machine;
  } catch (error) {
    console.error(`Error fetching machine with id ${id}:`, error);
    throw error;
  }
}

export async function createMachine(params: MachineCreateParams): Promise<Machine> {
  try {
    const { data, error } = await supabase
      .from("machines")
      .insert({
        serial_number: params.serial_number,
        model: params.model,
        status: params.status, // Will be converted to string
        client_id: params.client_id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Machine;
  } catch (error) {
    console.error("Error creating machine:", error);
    throw error;
  }
}

export async function updateMachine(id: string, params: MachineUpdateParams): Promise<Machine> {
  try {
    const updateData: any = {};
    
    if (params.serial_number !== undefined) updateData.serial_number = params.serial_number;
    if (params.model !== undefined) updateData.model = params.model;
    if (params.status !== undefined) updateData.status = params.status;
    if (params.client_id !== undefined) updateData.client_id = params.client_id;
    
    const { data, error } = await supabase
      .from("machines")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as Machine;
  } catch (error) {
    console.error(`Error updating machine ${id}:`, error);
    throw error;
  }
}

export async function transferMachine(params: MachineTransferParams): Promise<any> {
  try {
    const { data, error } = await supabase
      .from("machine_transfers")
      .insert({
        machine_id: params.machine_id,
        from_client_id: params.from_client_id,
        to_client_id: params.to_client_id,
        transfer_date: params.transfer_date || new Date().toISOString(),
        created_by: params.created_by,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update the machine's client_id
    const newStatus = params.to_client_id ? MachineStatus.ACTIVE : MachineStatus.STOCK;
    
    const { error: updateError } = await supabase
      .from("machines")
      .update({
        client_id: params.to_client_id,
        status: newStatus, // Will be converted to string
      })
      .eq("id", params.machine_id);

    if (updateError) {
      throw updateError;
    }

    return data;
  } catch (error) {
    console.error("Error transferring machine:", error);
    throw error;
  }
}

export async function getMachineStats(): Promise<MachineStats> {
  try {
    const { data: stockData, error: stockError } = await supabase
      .from("machines")
      .select("status")
      .eq("status", MachineStatus.STOCK);

    if (stockError) {
      throw stockError;
    }

    const stockCount = stockData.length;

    const { count: totalCount, error: countError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw countError;
    }

    const { data: statusData, error: statusError } = await supabase
      .from("machines")
      .select("status");

    if (statusError) {
      throw statusError;
    }

    // Calculate status counts
    const statusCounts = statusData.reduce((acc: Record<string, number>, machine: any) => {
      acc[machine.status] = (acc[machine.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate machines with clients
    const { count: withClientsCount, error: clientsError } = await supabase
      .from("machines")
      .select("*", { count: "exact", head: true })
      .not("client_id", "is", null);

    if (clientsError) {
      throw clientsError;
    }

    return {
      total: totalCount || 0,
      stock: stockCount,
      withClients: withClientsCount || 0,
      byStatus: statusCounts,
    };
  } catch (error) {
    console.error("Error getting machine stats:", error);
    throw error;
  }
}

export async function getMachinesByClient(clientId: string): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from("machines")
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data as Machine[];
  } catch (error) {
    console.error(`Error fetching machines for client ${clientId}:`, error);
    throw error;
  }
}

export async function getClientsWithMachines(): Promise<any[]> {
  try {
    // Get unique client IDs with machines
    const { data: clientIds, error } = await supabase
      .from("machines")
      .select("client_id")
      .not("client_id", "is", null)
      .order("client_id");

    if (error) {
      throw error;
    }

    // Extract unique client IDs
    const uniqueClientIds = [...new Set(clientIds.map(item => item.client_id))].filter(Boolean);

    // Get client details for each ID
    const { data: clients, error: clientsError } = await supabase
      .from("clients")
      .select("*")
      .in("id", uniqueClientIds);

    if (clientsError) {
      throw clientsError;
    }

    // Get machine counts for each client
    const clientsWithCounts = await Promise.all(
      clients.map(async (client) => {
        const { count, error: countError } = await supabase
          .from("machines")
          .select("*", { count: "exact", head: true })
          .eq("client_id", client.id);

        if (countError) {
          throw countError;
        }

        return {
          ...client,
          machineCount: count
        };
      })
    );

    return clientsWithCounts;
  } catch (error) {
    console.error("Error fetching clients with machines:", error);
    throw error;
  }
}
