
import { supabase } from '@/integrations/supabase/client';
import { 
  Machine, 
  MachineCreateParams, 
  MachineUpdateParams, 
  MachineTransferParams,
  MachineStatus,
  MachineStats
} from '@/types/machine.types';

/**
 * Get all machines with client information
 */
export const fetchMachines = async () => {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      id,
      serial_number,
      model,
      status,
      client_id,
      created_at,
      updated_at,
      client:clients (
        id,
        business_name
      )
    `)
    .order('serial_number', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Get machine statistics
 * Returns count of machines by status
 */
export const getMachineStats = async (): Promise<MachineStats> => {
  const { data, error } = await supabase
    .from('machines')
    .select('status');

  if (error) {
    throw new Error(error.message);
  }

  const total = data.length;
  const byStatus = data.reduce((acc: Record<string, number>, machine) => {
    acc[machine.status] = (acc[machine.status] || 0) + 1;
    return acc;
  }, {});

  const stock = byStatus[MachineStatus.STOCK] || 0;
  const inUse = total - stock;

  return {
    total,
    stock,
    withClients: inUse,
    byStatus
  };
};

/**
 * Get machines by client ID
 */
export const getMachinesByClient = async (clientId: string) => {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .eq('client_id', clientId);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

/**
 * Create a new machine
 */
export const createMachine = async (machine: MachineCreateParams) => {
  // Cast string to enum for type safety
  const { data, error } = await supabase
    .from('machines')
    .insert({
      serial_number: machine.serial_number,
      model: machine.model,
      status: machine.status as unknown as string,
      client_id: machine.client_id
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Update a machine
 */
export const updateMachine = async (id: string, updates: MachineUpdateParams) => {
  // Cast string to enum for type safety
  const { data, error } = await supabase
    .from('machines')
    .update({
      ...updates,
      status: updates.status as unknown as string
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Delete a machine
 */
export const deleteMachine = async (id: string) => {
  const { error } = await supabase
    .from('machines')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  return true;
};

/**
 * Transfer a machine between clients
 */
export const transferMachine = async (params: MachineTransferParams) => {
  const { machine_id, from_client_id, to_client_id, created_by } = params;
  
  // Start a transaction by using the rpc method
  const { error: transferError } = await supabase.rpc('transfer_machine', {
    p_machine_id: machine_id,
    p_from_client_id: from_client_id || null,
    p_to_client_id: to_client_id === 'stock' ? null : to_client_id,
    p_created_by: created_by,
  });

  if (transferError) {
    throw new Error(transferError.message);
  }

  // Update machine status based on the transfer
  let newStatus: MachineStatus;
  
  if (to_client_id === 'stock') {
    newStatus = MachineStatus.STOCK;
  } else {
    newStatus = MachineStatus.ACTIVE;
  }
  
  const { error: updateError } = await supabase
    .from('machines')
    .update({
      status: newStatus as unknown as string,
      client_id: to_client_id === 'stock' ? null : to_client_id,
    })
    .eq('id', machine_id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  return true;
};

/**
 * Get a machine by ID
 */
export const getMachineById = async (id: string) => {
  const { data, error } = await supabase
    .from('machines')
    .select(`
      *,
      client:clients (
        id,
        business_name
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

/**
 * Get machines in stock
 */
export const getMachinesInStock = async () => {
  const { data, error } = await supabase
    .from('machines')
    .select('*')
    .is('client_id', null);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};
