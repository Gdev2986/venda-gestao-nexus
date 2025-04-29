
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus } from "@/types";
import { useToast } from "./use-toast";

export const useMachines = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { toast } = useToast();
  
  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      const { data, error } = await supabase
        .from("machines")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        // Convert string status to enum MachineStatus
        const typedMachines = data.map(machine => ({
          ...machine,
          status: machine.status as MachineStatus
        }));
        setMachines(typedMachines);
      }
    } catch (err: any) {
      console.error("Error fetching machines:", err);
      setError(err.message || "Failed to fetch machines");
      toast({
        variant: "destructive",
        title: "Error loading machines",
        description: "There was a problem loading the machines data.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const createMachine = async (machineData: Omit<Machine, "id" | "created_at" | "updated_at">) => {
    try {
      const { error } = await supabase
        .from("machines")
        .insert([machineData]);
      
      if (error) throw error;
      
      toast({
        title: "Machine created",
        description: "The machine has been successfully added.",
      });
      
      fetchMachines();
      return true;
    } catch (err: any) {
      console.error("Error creating machine:", err);
      toast({
        variant: "destructive",
        title: "Error creating machine",
        description: err.message || "Failed to create machine.",
      });
      return false;
    }
  };
  
  const updateMachineStatus = async (machineId: string, status: MachineStatus) => {
    try {
      const { error } = await supabase
        .from("machines")
        .update({ status })
        .eq("id", machineId);
      
      if (error) throw error;
      
      setMachines(prev => 
        prev.map(machine => 
          machine.id === machineId ? { ...machine, status } : machine
        )
      );
      
      toast({
        title: "Status updated",
        description: `Machine status has been updated to ${status}.`,
      });
      
      return true;
    } catch (err: any) {
      console.error("Error updating machine status:", err);
      toast({
        variant: "destructive",
        title: "Error updating status",
        description: err.message || "Failed to update machine status.",
      });
      return false;
    }
  };
  
  const assignMachineToClient = async (machineId: string, clientId: string) => {
    try {
      const { error } = await supabase
        .from("machines")
        .update({ client_id: clientId })
        .eq("id", machineId);
      
      if (error) throw error;
      
      setMachines(prev => 
        prev.map(machine => 
          machine.id === machineId ? { ...machine, client_id: clientId } : machine
        )
      );
      
      toast({
        title: "Machine assigned",
        description: "The machine has been successfully assigned to the client.",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error assigning machine:", err);
      toast({
        variant: "destructive",
        title: "Error assigning machine",
        description: err.message || "Failed to assign machine to client.",
      });
      return false;
    }
  };
  
  const transferMachine = async (machineId: string, fromClientId: string | null, toClientId: string, userId: string) => {
    try {
      // Create transfer record
      const { error: transferError } = await supabase
        .from("machine_transfers")
        .insert([{
          machine_id: machineId,
          from_client_id: fromClientId,
          to_client_id: toClientId,
          created_by: userId
        }]);
      
      if (transferError) throw transferError;
      
      // Update machine client_id
      const { error: updateError } = await supabase
        .from("machines")
        .update({ client_id: toClientId })
        .eq("id", machineId);
      
      if (updateError) throw updateError;
      
      // Update local state
      setMachines(prev => 
        prev.map(machine => 
          machine.id === machineId ? { ...machine, client_id: toClientId } : machine
        )
      );
      
      toast({
        title: "Machine transferred",
        description: "The machine has been successfully transferred to the new client.",
      });
      
      return true;
    } catch (err: any) {
      console.error("Error transferring machine:", err);
      toast({
        variant: "destructive",
        title: "Error transferring machine",
        description: err.message || "Failed to transfer machine.",
      });
      return false;
    }
  };

  const getStatusLabel = (status: MachineStatus): string => {
    const statusLabels: Record<MachineStatus, string> = {
      [MachineStatus.ACTIVE]: "Active",
      [MachineStatus.INACTIVE]: "Inactive",
      [MachineStatus.MAINTENANCE]: "Maintenance",
      [MachineStatus.BLOCKED]: "Blocked"
    };
    
    return statusLabels[status] || "Unknown";
  };
  
  useEffect(() => {
    fetchMachines();
  }, []);
  
  return {
    machines,
    isLoading,
    error,
    fetchMachines,
    createMachine,
    updateMachineStatus,
    assignMachineToClient,
    transferMachine,
    getStatusLabel
  };
};
