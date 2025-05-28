
import { supabase } from "@/integrations/supabase/client";
import { MachineNote } from "@/types/machine.types";

export const getMachineNotes = async (machineId: string): Promise<MachineNote[]> => {
  try {
    const { data, error } = await supabase
      .from('machine_notes')
      .select(`
        *,
        user:created_by(name)
      `)
      .eq('machine_id', machineId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching machine notes:', error);
    throw error;
  }
};

export const createMachineNote = async (machineId: string, note: string, userId: string): Promise<MachineNote> => {
  try {
    const { data, error } = await supabase
      .from('machine_notes')
      .insert([{
        machine_id: machineId,
        note,
        created_by: userId
      }])
      .select(`
        *,
        user:created_by(name)
      `)
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating machine note:', error);
    throw error;
  }
};
