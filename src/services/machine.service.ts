
import { supabase } from "@/integrations/supabase/client";
import { 
  Machine, 
  MachineStatus, 
  MachineCreateParams, 
  MachineUpdateParams,
  MachineStats,
  MachineTransferParams
} from "@/types/machine.types";

export const machineService = {
  // Get all machines
  async getMachines(): Promise<Machine[]> {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as MachineStatus
    }));
  },

  // Get machine by ID
  async getMachineById(id: string): Promise<Machine | null> {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data ? { ...data, status: data.status as MachineStatus } : null;
  },

  // Get machines by status
  async getMachinesByStatus(status: MachineStatus): Promise<Machine[]> {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as MachineStatus
    }));
  },

  // Create multiple machines
  async createMachines(machines: MachineCreateParams[]): Promise<Machine[]> {
    const machineData = machines.map(machine => ({
      serial_number: machine.serial_number,
      model: machine.model,
      status: (machine.status || MachineStatus.STOCK) as string,
      client_id: machine.client_id || null,
      notes: machine.notes || null
    }));

    const { data, error } = await supabase
      .from('machines')
      .insert(machineData)
      .select(`
        *,
        client:clients(id, business_name)
      `);

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as MachineStatus
    }));
  },

  // Update machine
  async updateMachine(id: string, updates: MachineUpdateParams): Promise<Machine> {
    const updateData: any = {};
    
    if (updates.serial_number !== undefined) updateData.serial_number = updates.serial_number;
    if (updates.model !== undefined) updateData.model = updates.model;
    if (updates.status !== undefined) updateData.status = updates.status as string;
    if (updates.client_id !== undefined) updateData.client_id = updates.client_id;
    if (updates.notes !== undefined) updateData.notes = updates.notes;

    const { data, error } = await supabase
      .from('machines')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .single();

    if (error) throw error;
    return { ...data, status: data.status as MachineStatus };
  },

  // Delete machine
  async deleteMachine(id: string): Promise<void> {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Get machines by client
  async getMachinesByClient(clientId: string): Promise<Machine[]> {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as MachineStatus
    }));
  },

  // Get machine statistics
  async getMachineStats(): Promise<MachineStats> {
    const { data, error } = await supabase
      .from('machines')
      .select('status, client_id, model');

    if (error) throw error;

    const machines = data || [];
    const total = machines.length;
    
    const statusCounts = machines.reduce((acc, machine) => {
      acc[machine.status] = (acc[machine.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active: statusCounts[MachineStatus.ACTIVE] || 0,
      inactive: statusCounts[MachineStatus.INACTIVE] || 0,
      maintenance: statusCounts[MachineStatus.MAINTENANCE] || 0,
      blocked: statusCounts[MachineStatus.BLOCKED] || 0,
      stock: statusCounts[MachineStatus.STOCK] || 0,
      transit: statusCounts[MachineStatus.TRANSIT] || 0,
      byStatus: statusCounts
    };
  },

  // Filter machines
  async filterMachines(filters: {
    status?: MachineStatus;
    clientId?: string;
    model?: string;
    search?: string;
  }): Promise<Machine[]> {
    let query = supabase
      .from('machines')
      .select(`
        *,
        client:clients(id, business_name)
      `);

    if (filters.status) {
      query = query.eq('status', filters.status as string);
    }

    if (filters.clientId) {
      query = query.eq('client_id', filters.clientId);
    }

    if (filters.model) {
      query = query.eq('model', filters.model);
    }

    if (filters.search) {
      query = query.or(`serial_number.ilike.%${filters.search}%,model.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(item => ({
      ...item,
      status: item.status as MachineStatus
    }));
  },

  // Transfer machine to another client
  async transferMachine(params: MachineTransferParams): Promise<void> {
    // For now, just update the client_id directly since transfer_machine function doesn't exist
    const { error } = await supabase
      .from('machines')
      .update({ client_id: params.to_client_id })
      .eq('id', params.machine_id);

    if (error) throw error;
  },

  // Get clients with machines
  async getClientsWithMachines(): Promise<any[]> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        machines:machines(*)
      `);

    if (error) throw error;
    return data || [];
  }
};

// Export individual functions for backward compatibility
export const getMachines = machineService.getMachines;
export const getAllMachines = machineService.getMachines;
export const getMachineById = machineService.getMachineById;
export const getMachinesByStatus = machineService.getMachinesByStatus;
export const createMachine = async (machine: MachineCreateParams): Promise<Machine> => {
  const [created] = await machineService.createMachines([machine]);
  return created;
};
export const createMachines = machineService.createMachines;
export const updateMachine = machineService.updateMachine;
export const deleteMachine = machineService.deleteMachine;
export const getMachinesByClient = machineService.getMachinesByClient;
export const getMachineStats = machineService.getMachineStats;
export const filterMachines = machineService.filterMachines;
export const transferMachine = machineService.transferMachine;
export const getClientsWithMachines = machineService.getClientsWithMachines;
