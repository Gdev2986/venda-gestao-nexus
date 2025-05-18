
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStats, MachineStatus, MachineTransfer } from "@/types/machine.types";

// Type definitions
export interface MachineCreateParams {
  serial_number: string;
  model: string;
  status: string;
  client_id?: string;
}

export interface MachineUpdateParams {
  id: string;
  serial_number?: string;
  model?: string;
  status?: string;
  client_id?: string | null;
}

export interface MachineTransferParams {
  machine_id: string;
  to_client_id: string;
  from_client_id?: string;
  transfer_date?: string;
  cutoff_date?: string;
  created_by?: string;
}

// Helper to convert string status to enum safely
const normalizeStatus = (status: string): string => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case 'ACTIVE':
    case 'INACTIVE':
    case 'MAINTENANCE':
    case 'BLOCKED':
      return upperStatus;
    default:
      return 'ACTIVE'; // Default status
  }
};

/**
 * Gets a list of all machines with optional filtering
 */
export const getMachines = async (
  filter?: { status?: string; client_id?: string; search?: string }
): Promise<Machine[]> => {
  try {
    let query = supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `);

    // Apply filters if they exist
    if (filter?.status) {
      query = query.eq('status', filter.status);
    }

    if (filter?.client_id) {
      query = query.eq('client_id', filter.client_id);
    }

    if (filter?.search) {
      query = query.or(`serial_number.ilike.%${filter.search}%,model.ilike.%${filter.search}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }

    // Transform the data to match the Machine type
    return data.map(item => ({
      id: item.id,
      serial_number: item.serial_number,
      model: item.model,
      status: item.status,
      client_id: item.client_id || undefined,
      client_name: item.client?.business_name,
      created_at: item.created_at,
      updated_at: item.updated_at,
      client: item.client || undefined
    }));
  } catch (error) {
    console.error('Error in getMachines:', error);
    throw error;
  }
};

/**
 * Gets machine statistics
 */
export const getMachineStats = async (): Promise<MachineStats> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('status, client_id, model');

    if (error) {
      console.error('Error fetching machine stats:', error);
      throw error;
    }

    // Calculate statistics
    const total = data.length;
    const countByStatus: Record<string, number> = {};
    const countByClient: Record<string, number> = {};
    const countByModel: Record<string, number> = {};
    
    data.forEach(machine => {
      // Count by status
      const status = machine.status || 'UNKNOWN';
      countByStatus[status] = (countByStatus[status] || 0) + 1;
      
      // Count by client
      if (machine.client_id) {
        countByClient[machine.client_id] = (countByClient[machine.client_id] || 0) + 1;
      }
      
      // Count by model
      if (machine.model) {
        countByModel[machine.model] = (countByModel[machine.model] || 0) + 1;
      }
    });

    return {
      total,
      active: countByStatus['ACTIVE'] || 0,
      inactive: countByStatus['INACTIVE'] || 0,
      maintenance: countByStatus['MAINTENANCE'] || 0,
      blocked: countByStatus['BLOCKED'] || 0,
      stock: data.filter(m => !m.client_id).length,
      transit: 0, // Not tracked in this implementation
      byStatus: countByStatus,
      byClient: countByClient || {},
      byModel: countByModel || {}
    };
  } catch (error) {
    console.error('Error in getMachineStats:', error);
    throw new Error('Failed to retrieve machine statistics');
  }
};

/**
 * Gets a single machine by ID
 */
export const getMachineById = async (id: string): Promise<Machine | null> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching machine:', error);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      serial_number: data.serial_number,
      model: data.model,
      status: data.status as MachineStatus,
      client_id: data.client_id || undefined,
      client_name: data.client?.business_name,
      created_at: data.created_at,
      updated_at: data.updated_at,
      client: data.client || undefined
    };
  } catch (error) {
    console.error('Error in getMachineById:', error);
    return null;
  }
};

/**
 * Creates a new machine
 */
export const createMachine = async (machine: MachineCreateParams): Promise<Machine | null> => {
  try {
    // Normalize status to match the enum
    const normalizedStatus = normalizeStatus(machine.status);
    
    // Create the machine record
    const { data, error } = await supabase
      .from('machines')
      .insert({
        serial_number: machine.serial_number,
        model: machine.model,
        status: normalizedStatus,
        client_id: machine.client_id || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating machine:', error);
      throw error;
    }

    return data as Machine;
  } catch (error) {
    console.error('Error in createMachine:', error);
    throw error;
  }
};

/**
 * Updates an existing machine
 */
export const updateMachine = async (machine: MachineUpdateParams): Promise<Machine | null> => {
  try {
    // Create update object with only the fields that need updating
    const updateData: any = {};
    
    if (machine.serial_number !== undefined) updateData.serial_number = machine.serial_number;
    if (machine.model !== undefined) updateData.model = machine.model;
    if (machine.status !== undefined) updateData.status = normalizeStatus(machine.status);
    if (machine.client_id !== undefined) updateData.client_id = machine.client_id;
    
    // Update the machine
    const { data, error } = await supabase
      .from('machines')
      .update(updateData)
      .eq('id', machine.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating machine:', error);
      throw error;
    }

    return data as Machine;
  } catch (error) {
    console.error('Error in updateMachine:', error);
    throw error;
  }
};

/**
 * Creates a machine transfer record
 */
export const transferMachine = async (params: MachineTransferParams): Promise<MachineTransfer | null> => {
  try {
    // Get current client_id if not provided
    let fromClientId = params.from_client_id;
    if (!fromClientId) {
      const { data: machineData } = await supabase
        .from('machines')
        .select('client_id')
        .eq('id', params.machine_id)
        .single();
      fromClientId = machineData?.client_id || null;
    }
    
    // Create transfer record
    const transferData = {
      machine_id: params.machine_id,
      to_client_id: params.to_client_id,
      from_client_id: fromClientId,
      transfer_date: params.transfer_date || new Date().toISOString(),
      cutoff_date: params.cutoff_date || null,
      created_by: params.created_by || 'system'
    };
    
    const { data: transferRecord, error: transferError } = await supabase
      .from('machine_transfers')
      .insert(transferData)
      .select()
      .single();
    
    if (transferError) {
      console.error('Error creating machine transfer:', transferError);
      throw transferError;
    }
    
    // Update the machine's client_id
    const { error: updateError } = await supabase
      .from('machines')
      .update({ client_id: params.to_client_id })
      .eq('id', params.machine_id);
    
    if (updateError) {
      console.error('Error updating machine client:', updateError);
      throw updateError;
    }
    
    // Get complete transfer record with relations
    const { data: fullTransfer, error: fetchError } = await supabase
      .from('machine_transfers')
      .select(`
        *,
        machine:machines(*),
        from_client:clients!from_client_id(id, business_name),
        to_client:clients!to_client_id(id, business_name)
      `)
      .eq('id', transferRecord.id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching transfer details:', fetchError);
      return transferRecord as unknown as MachineTransfer;
    }
    
    // Safe type assertion for the returned data
    return {
      id: fullTransfer.id,
      machine_id: fullTransfer.machine_id,
      from_client_id: fullTransfer.from_client_id,
      to_client_id: fullTransfer.to_client_id,
      transfer_date: fullTransfer.transfer_date,
      cutoff_date: fullTransfer.cutoff_date,
      created_at: fullTransfer.created_at,
      created_by: fullTransfer.created_by,
      machine: fullTransfer.machine,
      from_client: {
        id: fullTransfer.from_client?.id || '',
        business_name: fullTransfer.from_client?.business_name || ''
      },
      to_client: {
        id: fullTransfer.to_client?.id || '',
        business_name: fullTransfer.to_client?.business_name || ''
      }
    };
  } catch (error) {
    console.error('Error in transferMachine:', error);
    throw error;
  }
};

/**
 * Gets machine transfer history
 */
export const getMachineTransferHistory = async (machineId: string): Promise<MachineTransfer[]> => {
  try {
    const { data, error } = await supabase
      .from('machine_transfers')
      .select(`
        *,
        machine:machines(*),
        from_client:clients!from_client_id(id, business_name),
        to_client:clients!to_client_id(id, business_name)
      `)
      .eq('machine_id', machineId)
      .order('transfer_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching machine transfer history:', error);
      throw error;
    }
    
    // Map to correct type
    return data.map(transfer => ({
      id: transfer.id,
      machine_id: transfer.machine_id,
      from_client_id: transfer.from_client_id,
      to_client_id: transfer.to_client_id,
      transfer_date: transfer.transfer_date,
      cutoff_date: transfer.cutoff_date,
      created_at: transfer.created_at,
      created_by: transfer.created_by,
      machine: transfer.machine,
      from_client: {
        id: transfer.from_client?.id || '',
        business_name: transfer.from_client?.business_name || ''
      },
      to_client: {
        id: transfer.to_client?.id || '',
        business_name: transfer.to_client?.business_name || ''
      }
    }));
  } catch (error) {
    console.error('Error in getMachineTransferHistory:', error);
    return [];
  }
};
