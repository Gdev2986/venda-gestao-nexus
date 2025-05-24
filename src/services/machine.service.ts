
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

    return data || [];
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

    return data;
  } catch (error) {
    console.error('Error in getMachineById:', error);
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

    return data;
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

    return data;
  } catch (error) {
    console.error('Error in updateMachine:', error);
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
