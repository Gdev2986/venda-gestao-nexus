
import { supabase } from "@/integrations/supabase/client";

export interface MachineNote {
  id: string;
  machine_id: string;
  note: string;
  created_at: string;
  created_by: string;
  user?: {
    name: string;
  };
}

export const getMachineNotes = async (machineId: string): Promise<MachineNote[]> => {
  try {
    // For now, return empty array until machine_notes table is created
    console.log(`Getting notes for machine ${machineId}`);
    return [];
  } catch (error) {
    console.error('Error in getMachineNotes:', error);
    throw error;
  }
};

export const addMachineNote = async (machineId: string, note: string, userId: string): Promise<MachineNote> => {
  try {
    // For now, return a mock note until machine_notes table is created
    const mockNote: MachineNote = {
      id: `note-${Date.now()}`,
      machine_id: machineId,
      note: note,
      created_at: new Date().toISOString(),
      created_by: userId,
      user: { name: 'Current User' }
    };
    console.log('Adding machine note:', mockNote);
    return mockNote;
  } catch (error) {
    console.error('Error in addMachineNote:', error);
    throw error;
  }
};

export const deleteMachineNote = async (noteId: string): Promise<void> => {
  try {
    console.log(`Deleting note ${noteId}`);
    // For now, just log until machine_notes table is created
  } catch (error) {
    console.error('Error in deleteMachineNote:', error);
    throw error;
  }
};
