
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus, MachineTransferParams } from "@/types/machine.types";

export const getMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(
          id,
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    })) || [];
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

// Alias for backwards compatibility
export const getAllMachines = getMachines;

export const getClientsWithMachines = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        business_name,
        email,
        machines:machines(
          id,
          serial_number,
          model,
          status
        )
      `)
      .not('machines', 'is', null);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching clients with machines:', error);
    throw error;
  }
};

export const getMachinesByStatus = async (status: MachineStatus): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(
          id,
          business_name
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    })) || [];
  } catch (error) {
    console.error('Error fetching machines by status:', error);
    throw error;
  }
};

export const createMachine = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .insert({
        serial_number: machineData.serial_number,
        model: machineData.model,
        status: machineData.status,
        client_id: machineData.client_id || null,
        notes: machineData.notes || null
      })
      .select(`
        *,
        client:clients(
          id,
          business_name
        )
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as MachineStatus
    };
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error;
  }
};

export const updateMachine = async (id: string, updates: Partial<Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>>): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .update({
        ...(updates.serial_number && { serial_number: updates.serial_number }),
        ...(updates.model && { model: updates.model }),
        ...(updates.status && { status: updates.status }),
        ...(updates.client_id !== undefined && { client_id: updates.client_id || null }),
        ...(updates.notes !== undefined && { notes: updates.notes || null }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        client:clients(
          id,
          business_name
        )
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as MachineStatus
    };
  } catch (error) {
    console.error('Error updating machine:', error);
    throw error;
  }
};

export const deleteMachine = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting machine:', error);
    throw error;
  }
};

export const transferMachine = async (transferData: MachineTransferParams): Promise<void> => {
  try {
    // Start a transaction
    const { error: transferError } = await supabase
      .from('machine_transfers')
      .insert({
        machine_id: transferData.machine_id,
        from_client_id: transferData.from_client_id || null,
        to_client_id: transferData.to_client_id,
        cutoff_date: transferData.cutoff_date,
        created_by: transferData.created_by || null,
        notes: transferData.notes || null,
        status: 'COMPLETED'
      });

    if (transferError) throw transferError;

    // Update machine's client_id
    const { error: updateError } = await supabase
      .from('machines')
      .update({ 
        client_id: transferData.to_client_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', transferData.machine_id);

    if (updateError) throw updateError;

  } catch (error) {
    console.error('Error transferring machine:', error);
    throw error;
  }
};

export const getMachineTransferHistory = async (machineId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_machine_transfer_history', {
      p_machine_id: machineId
    });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching machine transfer history:', error);
    throw error;
  }
};

export const getMachineStats = async () => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('status');

    if (error) throw error;

    const stats = {
      total: data?.length || 0,
      active: data?.filter(m => m.status === 'ACTIVE').length || 0,
      inactive: data?.filter(m => m.status === 'INACTIVE').length || 0,
      maintenance: data?.filter(m => m.status === 'MAINTENANCE').length || 0,
      stock: data?.filter(m => m.status === 'STOCK').length || 0,
      transit: data?.filter(m => m.status === 'TRANSIT').length || 0,
      blocked: data?.filter(m => m.status === 'BLOCKED').length || 0
    };

    return stats;
  } catch (error) {
    console.error('Error fetching machine stats:', error);
    throw error;
  }
};
