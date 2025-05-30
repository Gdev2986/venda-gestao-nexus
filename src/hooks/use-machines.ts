
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus } from "@/types/machine.types";

interface UseMachinesParams {
  searchTerm?: string;
  statusFilter?: string;
  page?: number;
}

interface ClientSuggestion {
  suggested_client_id: string;
  suggested_client_name: string;
  confidence_score: number;
}

export const useMachines = (params: UseMachinesParams = {}) => {
  const { searchTerm = "", statusFilter = "all", page = 1 } = params;
  
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    fetchMachines();
  }, [searchTerm, statusFilter, currentPage]);
  
  const fetchMachines = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('machines')
        .select(`
          id,
          serial_number,
          model,
          status,
          client_id,
          notes,
          created_at,
          updated_at,
          client:clients(
            id,
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      // Apply status filter
      if (statusFilter !== "all") {
        query = query.eq('status', statusFilter as MachineStatus);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(`serial_number.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedMachines: Machine[] = (data || []).map(machine => ({
        id: machine.id,
        serial_number: machine.serial_number,
        model: machine.model,
        status: machine.status as MachineStatus,
        client_id: machine.client_id,
        notes: machine.notes,
        created_at: machine.created_at,
        updated_at: machine.updated_at,
        client: machine.client ? {
          id: machine.client.id,
          business_name: machine.client.business_name
        } : null
      }));

      setMachines(formattedMachines);
      setTotalPages(1); // For simplicity, implement pagination later if needed
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const refreshMachines = () => {
    fetchMachines();
  };

  // Get client suggestions for a machine
  const getClientSuggestions = async (machineId: string): Promise<ClientSuggestion[]> => {
    try {
      const { data, error } = await supabase.rpc('suggest_client_for_machine', {
        p_machine_id: machineId
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error getting client suggestions:", error);
      return [];
    }
  };

  // Update machine client association
  const updateMachineClient = async (machineId: string, clientId: string | null) => {
    try {
      const { error } = await supabase
        .from('machines')
        .update({ 
          client_id: clientId,
          updated_at: new Date().toISOString()
        })
        .eq('id', machineId);

      if (error) throw error;
      
      await refreshMachines();
      return true;
    } catch (error) {
      console.error("Error updating machine client:", error);
      return false;
    }
  };
  
  return { 
    machines, 
    isLoading, 
    currentPage, 
    totalPages, 
    onPageChange,
    refreshMachines,
    getClientSuggestions,
    updateMachineClient
  };
};

export const saveMachine = async (machineData: any) => {
  try {
    if (machineData.id) {
      // Update existing machine
      const { data, error } = await supabase
        .from('machines')
        .update({
          serial_number: machineData.serialNumber,
          model: machineData.model,
          status: machineData.status,
          client_id: machineData.clientId || null,
          notes: machineData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', machineData.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new machine
      const { data, error } = await supabase
        .from('machines')
        .insert({
          serial_number: machineData.serialNumber,
          model: machineData.model,
          status: machineData.status,
          client_id: machineData.clientId || null,
          notes: machineData.notes || null
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error("Error saving machine:", error);
    throw error;
  }
};
