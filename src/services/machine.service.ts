import { supabase } from '@/integrations/supabase/client';
import {
  Machine,
  MachineStats,
  MachineCreateParams,
  MachineUpdateParams,
  MachineStatus,
  MachineTransfer,
  MachineTransferParams
} from '@/types/machine.types';

/**
 * Get all machines
 */
export async function getAllMachines(): Promise<Machine[]> {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      client:client_id (
        id,
        business_name,
        address,
        city,
        state
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching machines:', error);
    throw new Error(error.message);
  }

  return data as Machine[];
}

/**
 * Get client's machines
 */
export async function getClientMachines(clientId: string): Promise<Machine[]> {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('client_id', clientId);

  if (error) {
    console.error(`Error fetching machines for client ${clientId}:`, error);
    throw new Error(error.message);
  }

  return data as Machine[];
}

/**
 * Get all machines stats by status
 */
export async function getMachineStats(): Promise<MachineStats> {
  const { data, error } = await supabase
    .from('machines')
    .select('status');

  if (error) {
    console.error('Error fetching machine stats:', error);
    throw new Error(error.message);
  }

  // Count machines by status
  const stats: MachineStats = {
    total: data.length,
    active: 0,
    inactive: 0,
    maintenance: 0,
    blocked: 0,
    stock: 0,
    transit: 0,
    byStatus: {}
  };

  data.forEach(machine => {
    const status = machine.status as MachineStatus;
    
    switch (status) {
      case MachineStatus.ACTIVE:
        stats.active++;
        break;
      case MachineStatus.INACTIVE:
        stats.inactive++;
        break;
      case MachineStatus.MAINTENANCE:
        stats.maintenance++;
        break;
      case MachineStatus.BLOCKED:
        stats.blocked++;
        break;
      case MachineStatus.STOCK:
        stats.stock++;
        break;
      case MachineStatus.TRANSIT:
        stats.transit++;
        break;
    }
    
    // Also track in byStatus
    if (!stats.byStatus![status]) {
      stats.byStatus![status] = 1;
    } else {
      stats.byStatus![status]++;
    }
  });

  return stats;
}

/**
 * Get machines by status
 */
export async function getMachinesByStatus(status: MachineStatus): Promise<Machine[]> {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      client:client_id (
        id,
        business_name,
        address,
        city,
        state
      )
    `)
    .eq('status', status.toString());

  if (error) {
    console.error(`Error fetching machines with status ${status}:`, error);
    throw new Error(error.message);
  }

  return data as Machine[];
}

/**
 * Get clients with machines
 */
export async function getClientsWithMachines(): Promise<any[]> {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      client_id,
      client:client_id (
        id,
        business_name,
        address,
        city,
        state
      )
    `)
    .not('client_id', 'is', null)
    .order('client_id');

  if (error) {
    console.error('Error fetching clients with machines:', error);
    throw new Error(error.message);
  }
  
  // Group machines by client
  const clientsMap = new Map();
  data.forEach(machine => {
    if (!clientsMap.has(machine.client_id)) {
      clientsMap.set(machine.client_id, machine.client);
    }
  });
  
  return Array.from(clientsMap.values());
}

/**
 * Create a new machine
 */
export async function createMachine(params: MachineCreateParams): Promise<Machine> {
  const { data, error } = await supabase
    .from('machines')
    .insert(params)
    .select()
    .single();

  if (error) {
    console.error('Error creating machine:', error);
    throw new Error(error.message);
  }

  return data as Machine;
}

/**
 * Update an existing machine
 */
export async function updateMachine(id: string, params: MachineUpdateParams): Promise<Machine> {
  const { data, error } = await supabase
    .from('machines')
    .update(params)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating machine with id ${id}:`, error);
    throw new Error(error.message);
  }

  return data as Machine;
}

/**
 * Delete a machine
 */
export async function deleteMachine(id: string): Promise<void> {
  const { error } = await supabase
    .from('machines')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting machine with id ${id}:`, error);
    throw new Error(error.message);
  }
}

/**
 * Transfer a machine to another client
 */
export async function transferMachine(params: MachineTransferParams): Promise<MachineTransfer> {
  const { data, error } = await supabase
    .from('machine_transfers')
    .insert(params)
    .select(`
      *,
      machine:machine_id (
        id,
        serial_number,
        model,
        status
      ),
      from_client:from_client_id (
        id,
        business_name
      ),
      to_client:to_client_id (
        id,
        business_name
      )
    `)
    .single();

  if (error) {
    console.error('Error transferring machine:', error);
    throw new Error(error.message);
  }

  return data as MachineTransfer;
}

/**
 * Get all machine transfers
 */
export async function getAllMachineTransfers(): Promise<MachineTransfer[]> {
  const { data, error } = await supabase
    .from('machine_transfers')
    .select(`
      *,
      machine:machine_id (
        id,
        serial_number,
        model,
        status
      ),
      from_client:from_client_id (
        id,
        business_name
      ),
      to_client:to_client_id (
        id,
        business_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching machine transfers:', error);
    throw new Error(error.message);
  }

  return data as MachineTransfer[];
}
