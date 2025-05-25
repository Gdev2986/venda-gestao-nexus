
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus } from "@/types/machine.types";

export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus,
      client: machine.client || null
    })) || [];
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

export const getMachineById = async (id: string): Promise<Machine | null> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return data ? {
      ...data,
      status: data.status as MachineStatus,
      client: data.client || null
    } : null;
  } catch (error) {
    console.error('Error fetching machine:', error);
    return null;
  }
};

export const createMachine = async (machineData: Omit<Machine, 'id' | 'created_at' | 'updated_at' | 'client'>): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .insert([machineData])
      .select(`
        *,
        client:clients(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as MachineStatus,
      client: data.client || null
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
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        client:clients(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as MachineStatus,
      client: data.client || null
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

export const getMachinesByStatus = async (status: MachineStatus): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(*)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus,
      client: machine.client || null
    })) || [];
  } catch (error) {
    console.error('Error fetching machines by status:', error);
    throw error;
  }
};

export const transferMachine = async (machineId: string, newClientId: string | null): Promise<Machine> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .update({ client_id: newClientId })
      .eq('id', machineId)
      .select(`
        *,
        client:clients(*)
      `)
      .single();

    if (error) throw error;

    return {
      ...data,
      status: data.status as MachineStatus,
      client: data.client || null
    };
  } catch (error) {
    console.error('Error transferring machine:', error);
    throw error;
  }
};

export const getMachineStats = async () => {
  try {
    const { data: machines, error } = await supabase
      .from('machines')
      .select('status');

    if (error) throw error;

    const stats = machines?.reduce((acc, machine) => {
      const status = machine.status as MachineStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<MachineStatus, number>) || {};

    return {
      total: machines?.length || 0,
      active: stats[MachineStatus.ACTIVE] || 0,
      inactive: stats[MachineStatus.INACTIVE] || 0,
      maintenance: stats[MachineStatus.MAINTENANCE] || 0,
      blocked: stats[MachineStatus.BLOCKED] || 0,
      stock: stats[MachineStatus.STOCK] || 0,
      transit: stats[MachineStatus.TRANSIT] || 0
    };
  } catch (error) {
    console.error('Error fetching machine stats:', error);
    throw error;
  }
};

export const getClientsWithMachines = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        machines:machines(*)
      `)
      .order('business_name');

    if (error) throw error;

    return data?.map(client => ({
      ...client,
      machines: client.machines?.map((machine: any) => ({
        ...machine,
        status: machine.status as MachineStatus
      })) || []
    })) || [];
  } catch (error) {
    console.error('Error fetching clients with machines:', error);
    throw error;
  }
};
