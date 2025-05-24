import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus, MachineCreateParams, MachineUpdateParams } from "@/types/machine.types";

export const getAllMachines = async (): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching machines:', error);
      throw new Error(`Erro ao buscar máquinas: ${error.message}`);
    }

    return (data || []).map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    }));
  } catch (error) {
    console.error('Error in getAllMachines:', error);
    throw error;
  }
};

export const getMachineById = async (id: string): Promise<Machine | null> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching machine:', error);
      throw new Error(`Erro ao buscar máquina: ${error.message}`);
    }

    return data ? {
      ...data,
      status: data.status as MachineStatus
    } : null;
  } catch (error) {
    console.error('Error in getMachineById:', error);
    throw error;
  }
};

export const getMachinesByStatus = async (status: MachineStatus): Promise<Machine[]> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching machines by status:', error);
      throw new Error(`Erro ao buscar máquinas por status: ${error.message}`);
    }

    return (data || []).map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    }));
  } catch (error) {
    console.error('Error in getMachinesByStatus:', error);
    throw error;
  }
};

export const getMachineStats = async (): Promise<{
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
  blocked: number;
  stock: number;
  transit: number;
  byStatus: Record<string, number>;
}> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('status');

    if (error) {
      console.error('Error fetching machine stats:', error);
      throw new Error(`Erro ao buscar estatísticas das máquinas: ${error.message}`);
    }

    const stats = {
      total: data?.length || 0,
      active: 0,
      inactive: 0,
      maintenance: 0,
      blocked: 0,
      stock: 0,
      transit: 0,
      byStatus: {} as Record<string, number>
    };

    data?.forEach(machine => {
      stats.byStatus[machine.status] = (stats.byStatus[machine.status] || 0) + 1;
      
      switch (machine.status) {
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
    });

    return stats;
  } catch (error) {
    console.error('Error in getMachineStats:', error);
    throw error;
  }
};

export const getClientsWithMachines = async (): Promise<Array<{
  id: string;
  business_name: string;
  machineCount: number;
  machines?: Array<{id: string; status: string}>;
}>> => {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        id,
        status,
        client:client_id (
          id,
          business_name
        )
      `)
      .not('client_id', 'is', null);

    if (error) {
      console.error('Error fetching clients with machines:', error);
      throw new Error(`Erro ao buscar clientes com máquinas: ${error.message}`);
    }

    // Group machines by client
    const clientsMap = new Map<string, {
      id: string;
      business_name: string;
      machineCount: number;
      machines: Array<{id: string; status: string}>;
    }>();

    data?.forEach(machine => {
      if (machine.client) {
        const clientId = machine.client.id;
        if (!clientsMap.has(clientId)) {
          clientsMap.set(clientId, {
            id: machine.client.id,
            business_name: machine.client.business_name,
            machineCount: 0,
            machines: []
          });
        }
        
        const client = clientsMap.get(clientId)!;
        client.machineCount++;
        client.machines.push({
          id: machine.id,
          status: machine.status
        });
      }
    });

    return Array.from(clientsMap.values());
  } catch (error) {
    console.error('Error in getClientsWithMachines:', error);
    throw error;
  }
};

export const createMachine = async (params: MachineCreateParams): Promise<Machine> => {
  try {
    // Check if serial number already exists
    const { data: existingMachine, error: checkError } = await supabase
      .from('machines')
      .select('serial_number')
      .eq('serial_number', params.serial_number)
      .single();

    if (existingMachine) {
      throw new Error('Já existe uma máquina cadastrada com este número de série.');
    }

    const { data, error } = await supabase
      .from('machines')
      .insert({
        serial_number: params.serial_number,
        model: params.model,
        status: params.status || MachineStatus.STOCK,
        client_id: params.client_id || null,
        notes: params.notes || null
      })
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .single();

    if (error) {
      console.error('Error creating machine:', error);
      throw new Error(`Erro ao criar máquina: ${error.message}`);
    }

    return {
      ...data,
      status: data.status as MachineStatus
    };
  } catch (error) {
    console.error('Error in createMachine:', error);
    throw error;
  }
};

export const updateMachine = async (id: string, params: MachineUpdateParams): Promise<Machine> => {
  try {
    // Check if serial number already exists (excluding current machine)
    if (params.serial_number) {
      const { data: existingMachine, error: checkError } = await supabase
        .from('machines')
        .select('id, serial_number')
        .eq('serial_number', params.serial_number)
        .neq('id', id)
        .single();

      if (existingMachine) {
        throw new Error('Já existe uma máquina cadastrada com este número de série.');
      }
    }

    const { data, error } = await supabase
      .from('machines')
      .update({
        ...(params.serial_number !== undefined && { serial_number: params.serial_number }),
        ...(params.model !== undefined && { model: params.model }),
        ...(params.status !== undefined && { status: params.status }),
        ...(params.client_id !== undefined && { client_id: params.client_id }),
        ...(params.notes !== undefined && { notes: params.notes }),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .single();

    if (error) {
      console.error('Error updating machine:', error);
      throw new Error(`Erro ao atualizar máquina: ${error.message}`);
    }

    return {
      ...data,
      status: data.status as MachineStatus
    };
  } catch (error) {
    console.error('Error in updateMachine:', error);
    throw error;
  }
};

export const transferMachine = async (params: {
  machine_id: string;
  from_client_id?: string;
  to_client_id: string;
  cutoff_date?: string;
  created_by?: string;
}): Promise<Machine> => {
  try {
    // First, update the machine's client_id
    const { data: machine, error: updateError } = await supabase
      .from('machines')
      .update({ 
        client_id: params.to_client_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.machine_id)
      .select(`
        *,
        client:client_id (
          id,
          business_name
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating machine client:', updateError);
      throw new Error(`Erro ao transferir máquina: ${updateError.message}`);
    }

    // Then, create a transfer record if machine_transfers table exists
    try {
      await supabase
        .from('machine_transfers')
        .insert({
          machine_id: params.machine_id,
          from_client_id: params.from_client_id,
          to_client_id: params.to_client_id,
          transfer_date: new Date().toISOString(),
          cutoff_date: params.cutoff_date,
          created_by: params.created_by || 'system'
        });
    } catch (transferError) {
      // If machine_transfers table doesn't exist, just log it but continue
      console.log('Machine transfers table not found, continuing with just client update');
    }

    return {
      ...machine,
      status: machine.status as MachineStatus
    };
  } catch (error) {
    console.error('Error in transferMachine:', error);
    throw error;
  }
};

export const deleteMachine = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting machine:', error);
      throw new Error(`Erro ao excluir máquina: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteMachine:', error);
    throw error;
  }
};
