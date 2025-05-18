
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllMachines, 
  getMachinesByStatus, 
  createMachine, 
  updateMachine, 
  transferMachine,
  getMachineStats
} from "@/services/machine.service";
import { supabase } from "@/integrations/supabase/client";
import {
  Machine,
  MachineStatus,
  MachineCreateParams,
  MachineUpdateParams,
  MachineTransferParams,
  MachineStats
} from "@/types/machine.types";

interface UseMachinesOptions {
  status?: MachineStatus;
  clientId?: string;
  initialFetch?: boolean;
  enableRealtime?: boolean;
}

export function useMachines(options: UseMachinesOptions = {}) {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [stats, setStats] = useState<MachineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchMachines = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: Machine[];
      
      if (options.status) {
        data = await getMachinesByStatus(options.status);
      } else {
        data = await getAllMachines();
      }

      // Filter by client if needed
      if (options.clientId) {
        data = data.filter(machine => machine.client_id === options.clientId);
      }

      setMachines(data);
      
      // Fetch stats if needed
      if (!options.status && !options.clientId) {
        const statsData = await getMachineStats();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err);
      console.error("Error fetching machines:", err);
      toast({
        title: "Error",
        description: "Failed to fetch machines data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMachine = async (machineData: MachineCreateParams) => {
    try {
      const newMachine = await createMachine(machineData);
      toast({
        title: "Máquina criada",
        description: "A máquina foi adicionada com sucesso",
      });
      return newMachine;
    } catch (err: any) {
      console.error("Error creating machine:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao criar máquina",
        variant: "destructive",
      });
      throw err;
    }
  };

  const modifyMachine = async (id: string, machineData: MachineUpdateParams) => {
    try {
      const updatedMachine = await updateMachine(id, machineData);
      toast({
        title: "Máquina atualizada",
        description: "A máquina foi atualizada com sucesso",
      });
      return updatedMachine;
    } catch (err: any) {
      console.error("Error updating machine:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao atualizar máquina",
        variant: "destructive",
      });
      throw err;
    }
  };

  const transferMachineToClient = async (params: MachineTransferParams) => {
    try {
      const result = await transferMachine(params);
      toast({
        title: "Máquina transferida",
        description: "A máquina foi transferida com sucesso",
      });
      return result;
    } catch (err: any) {
      console.error("Error transferring machine:", err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao transferir máquina",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (options.initialFetch !== false) {
      fetchMachines();
    }
  }, [options.status, options.clientId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!options.enableRealtime) return;

    const channel = supabase
      .channel("machine-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "machines" },
        () => {
          // Refresh data when any change occurs
          fetchMachines();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.enableRealtime, options.status, options.clientId]);

  return {
    machines,
    stats,
    isLoading,
    error,
    fetchMachines,
    addMachine,
    updateMachine: modifyMachine,
    transferMachine: transferMachineToClient
  };
}
