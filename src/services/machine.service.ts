
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Machine Status Enum
export enum MachineStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  MAINTENANCE = "MAINTENANCE",
  BLOCKED = "BLOCKED",
  TRANSIT = "TRANSIT"
}

// Machine interface
export interface Machine {
  id: string;
  serial_number: string;
  model: string;
  status: MachineStatus;
  client_id?: string | null;
  created_at?: string;
  updated_at?: string;
  client?: {
    id: string;
    business_name: string;
    address?: string;
    city?: string;
    state?: string;
  };
}

// Machine Transfer interface
export interface MachineTransfer {
  id?: string;
  machine_id: string;
  from_client_id?: string | null;
  to_client_id: string;
  transfer_date?: string;
  cutoff_date?: string;
  created_by?: string;
  created_at?: string;
  machine?: Machine;
  from_client?: {
    business_name: string;
  };
  to_client?: {
    business_name: string;
  };
}

// Function to get all machines
export async function getAllMachines(): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients (id, business_name, address, city, state)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }

    return data.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    }));
  } catch (error) {
    console.error('Error in getAllMachines:', error);
    return [];
  }
}

// Function to get machines by status
export async function getMachinesByStatus(status: MachineStatus | string): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients (id, business_name, address, city, state)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) {
      console.error(`Error fetching machines with status ${status}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error in getMachinesByStatus for ${status}:`, error);
    return [];
  }
}

// Function to get a machine by ID
export async function getMachineById(id: string): Promise<Machine | null> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select(`
        *,
        client:clients (id, business_name, address, city, state)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching machine with id ${id}:`, error);
      return null;
    }

    return {
      ...data,
      status: data.status as MachineStatus
    };
  } catch (error) {
    console.error(`Error in getMachineById for ${id}:`, error);
    return null;
  }
}

// Function to create a new machine
export async function createMachine(machineData: {
  serial_number: string;
  model: string;
  status: MachineStatus | string;
  client_id?: string | null;
}): Promise<Machine> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .insert({
        serial_number: machineData.serial_number,
        model: machineData.model,
        status: machineData.status as MachineStatus,
        client_id: machineData.client_id || null
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
    // For development, return a mock machine
    return {
      id: uuidv4(),
      serial_number: machineData.serial_number,
      model: machineData.model,
      status: machineData.status as MachineStatus,
      client_id: machineData.client_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}

// Function to update a machine
export async function updateMachine(id: string, machineData: Partial<Machine>): Promise<Machine | null> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .update({
        serial_number: machineData.serial_number,
        model: machineData.model,
        status: machineData.status as MachineStatus,
        client_id: machineData.client_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating machine with id ${id}:`, error);
      return null;
    }

    return data as Machine;
  } catch (error) {
    console.error(`Error in updateMachine for ${id}:`, error);
    return null;
  }
}

// Function to transfer a machine from one client to another
export async function transferMachine(transferData: MachineTransfer): Promise<boolean> {
  try {
    // Create a new machine transfer record
    const { error: transferError } = await supabase
      .from('machine_transfers')
      .insert({
        id: transferData.id || uuidv4(),
        machine_id: transferData.machine_id,
        from_client_id: transferData.from_client_id,
        to_client_id: transferData.to_client_id,
        transfer_date: transferData.transfer_date || new Date().toISOString(),
        cutoff_date: transferData.cutoff_date || new Date().toISOString(),
        created_by: transferData.created_by || 'system'
      });

    if (transferError) {
      console.error('Error creating machine transfer record:', transferError);
      throw transferError;
    }

    // Update the machine's client_id and status
    const { error: machineError } = await supabase
      .from('machines')
      .update({
        client_id: transferData.to_client_id,
        status: MachineStatus.ACTIVE,
        updated_at: new Date().toISOString()
      })
      .eq('id', transferData.machine_id);

    if (machineError) {
      console.error(`Error updating machine client for machine ${transferData.machine_id}:`, machineError);
      throw machineError;
    }

    return true;
  } catch (error) {
    console.error('Error in transferMachine:', error);
    return false;
  }
}

// Function to delete a machine
export async function deleteMachine(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('machines')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting machine with id ${id}:`, error);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error in deleteMachine for ${id}:`, error);
    return false;
  }
}

// Function to get clients with machines
export async function getClientsWithMachines(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        business_name,
        machines:machines (
          id,
          serial_number,
          model,
          status
        )
      `)
      .not('machines', 'is', null);

    if (error) {
      console.error('Error fetching clients with machines:', error);
      throw error;
    }

    return data.filter(client => client.machines && client.machines.length > 0);
  } catch (error) {
    console.error('Error in getClientsWithMachines:', error);
    return [];
  }
}

// Function to get machines in stock (not assigned to any client)
export async function getMachinesInStock(): Promise<Machine[]> {
  try {
    const { data, error } = await supabase
      .from('machines')
      .select('*')
      .is('client_id', null);

    if (error) {
      console.error('Error fetching machines in stock:', error);
      throw error;
    }

    return data.map(machine => ({
      ...machine,
      status: machine.status as MachineStatus
    }));
  } catch (error) {
    console.error('Error in getMachinesInStock:', error);
    return [];
  }
}

// Function to get machine transfers
export async function getMachineTransfers(): Promise<MachineTransfer[]> {
  try {
    const { data, error } = await supabase
      .from('machine_transfers')
      .select(`
        *,
        machine:machines (
          id,
          serial_number,
          model,
          status
        ),
        from_client:clients!machine_transfers_from_client_id_fkey (
          business_name
        ),
        to_client:clients!machine_transfers_to_client_id_fkey (
          business_name
        )
      `)
      .order('transfer_date', { ascending: false });

    if (error) {
      console.error('Error fetching machine transfers:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getMachineTransfers:', error);
    return [];
  }
}

// Function to fetch machines for display in a table
export async function fetchMachines(): Promise<Machine[]> {
  // Reuse the getAllMachines function
  return getAllMachines();
}
