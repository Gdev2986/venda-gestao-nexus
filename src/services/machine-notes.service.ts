import { supabase } from "@/integrations/supabase/client";
import { MachineNote } from "@/types/machine.types";

export const getMachineNotes = async (machineId: string): Promise<MachineNote[]> => {
  try {
    const { data, error } = await supabase
      .from('machine_notes')
      .select(`
        *,
        user:created_by (
          name
        )
      `)
      .eq('machine_id', machineId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching machine notes:', error);
      throw new Error(`Erro ao buscar notas da máquina: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMachineNotes:', error);
    throw error;
  }
};

export const addMachineNote = async (machineId: string, note: string, userId: string): Promise<MachineNote> => {
  try {
    const { data, error } = await supabase
      .from('machine_notes')
      .insert({
        machine_id: machineId,
        note: note,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        user:created_by (
          name
        )
      `)
      .single();

    if (error) {
      console.error('Error adding machine note:', error);
      throw new Error(`Erro ao adicionar nota: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in addMachineNote:', error);
    throw error;
  }
};

export const deleteMachineNote = async (noteId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('machine_notes')
      .delete()
      .eq('id', noteId);

    if (error) {
      console.error('Error deleting machine note:', error);
      throw new Error(`Erro ao excluir nota: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteMachineNote:', error);
    throw error;
  }
}; 