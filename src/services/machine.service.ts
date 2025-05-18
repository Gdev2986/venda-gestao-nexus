
import { supabase } from '@/integrations/supabase/client';
import { 
  Machine, 
  MachineStatus, 
  MachineCreateParams, 
  MachineUpdateParams, 
  MachineTransferParams,
  MachineTransfer,
  MachineStats
} from '@/types/machine.types';

// Helper function to convert string status to enum
function toMachineStatus(status: string | MachineStatus): MachineStatus {
  if (typeof status === 'string') {
    // Ensure the string is a valid enum value
    return status as MachineStatus;
  }
  return status;
}

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

  // Convert status strings to enum values
  return data.map(machine => ({
    ...machine,
    status: toMachineStatus(machine.status)
  })) as Machine[];
}

/**
 * Get machines by status
 */
export async function getMachinesByStatus(status: MachineStatus): Promise<Machine[]> {
  const statusValue = typeof status === 'string' ? status : status;
  
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
    .eq('status', statusValue)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching machines with status ${status}:`, error);
    throw new Error(error.message);
  }

  // Convert status strings to enum values
  return data.map(machine => ({
    ...machine,
    status: toMachineStatus(machine.status)
  })) as Machine[];
}

/**
 * Get machine stats
 */
export async function getMachineStats(): Promise<MachineStats> {
  // Get all machines to calculate stats
  const { data, error } = await supabase
    .from('machines')
    .select('status, model');

  if (error) {
    console.error('Error fetching machine stats:', error);
    throw new Error(error.message);
  }

  // Calculate statistics
  const stats: MachineStats = {
    total: data.length,
    active: 0,
    inactive: 0,
    maintenance: 0,
    stock: 0,
    transit: 0,
    blocked: 0,
    by_model: {}
  };

  // Count by status and model
  data.forEach(machine => {
    const status = machine.status as MachineStatus;
    
    // Count by status
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
      case MachineStatus.STOCK:
        stats.stock++;
        break;
      case MachineStatus.TRANSIT:
        stats.transit++;
        break;
      case MachineStatus.BLOCKED:
        stats.blocked++;
        break;
    }

    // Count by model
    const model = machine.model;
    if (!stats.by_model) stats.by_model = {};
    if (stats.by_model[model]) {
      stats.by_model[model]++;
    } else {
      stats.by_model[model] = 1;
    }
  });

  return stats;
}

/**
 * Create a new machine
 */
export async function createMachine(machineData: MachineCreateParams): Promise<Machine> {
  const { serial_number, model, status = MachineStatus.STOCK, client_id } = machineData;

  const { data, error } = await supabase
    .from('machines')
    .insert({
      serial_number,
      model,
      status: status,
      client_id: client_id || null
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating machine:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toMachineStatus(data.status)
  } as Machine;
}

/**
 * Update a machine
 */
export async function updateMachine(id: string, updates: MachineUpdateParams): Promise<Machine> {
  // Convert status enum to string if present
  const updatesForDB: any = { ...updates };
  if (updatesForDB.status) {
    updatesForDB.status = updatesForDB.status.toString();
  }

  const { data, error } = await supabase
    .from('machines')
    .update(updatesForDB)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating machine:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: toMachineStatus(data.status)
  } as Machine;
}

/**
 * Delete a machine
 */
export async function deleteMachine(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('machines')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting machine:', error);
    throw new Error(error.message);
  }

  return true;
}

/**
 * Transfer a machine between clients
 */
export async function transferMachine(params: MachineTransferParams): Promise<boolean> {
  // Extract parameters
  const { machine_id, from_client_id, to_client_id, created_by } = params;

  try {
    // First update the machine's client_id
    const { error: machineError } = await supabase
      .from('machines')
      .update({ 
        client_id: to_client_id,
        status: MachineStatus.ACTIVE
      })
      .eq('id', machine_id);

    if (machineError) throw new Error(machineError.message);

    // Then create a transfer record
    const { error: transferError } = await supabase
      .from('machine_transfers')
      .insert({
        machine_id,
        from_client_id,
        to_client_id,
        created_by
      });

    if (transferError) throw new Error(transferError.message);

    return true;
  } catch (error) {
    console.error('Error transferring machine:', error);
    throw error;
  }
}

/**
 * Get machine transfer history
 */
export async function getMachineTransfers(machineId: string): Promise<MachineTransfer[]> {
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
    .eq('machine_id', machineId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching machine transfers:', error);
    throw new Error(error.message);
  }

  // Convert status strings to enum values if machine is present
  return data.map(transfer => {
    if (transfer.machine) {
      return {
        ...transfer,
        machine: {
          ...transfer.machine,
          status: toMachineStatus(transfer.machine.status)
        }
      };
    }
    return transfer;
  }) as MachineTransfer[];
}

/**
 * Get machines by client
 */
export async function getMachinesByClient(clientId: string): Promise<Machine[]> {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('client_id', clientId);

  if (error) {
    console.error('Error fetching client machines:', error);
    throw new Error(error.message);
  }

  // Convert status strings to enum values
  return data.map(machine => ({
    ...machine,
    status: toMachineStatus(machine.status)
  })) as Machine[];
}
