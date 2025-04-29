
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Machine, MachineStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

// Define a more specific type for the machine data from the database to avoid deep type instantiation
interface MachineDb {
  id: string;
  serial_number: string;
  model: string;
  status: string; // This will be cast to MachineStatus enum
  client_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useMachines = () => {
  const { user } = useAuth();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientId, setClientId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch client ID
  const fetchClientId = async () => {
    if (!user) return null;
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setClientId(data.id);
        return data.id;
      }
      
      return null;
    } catch (error) {
      console.error("Error fetching client ID:", error);
      return null;
    }
  };
  
  // Fetch machines
  const fetchMachines = async (cid: string) => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .eq('client_id', cid);
      
      if (error) throw error;
      
      // Convert database status to MachineStatus enum
      const machinesWithCorrectStatus: Machine[] = (data || []).map((machine: MachineDb) => ({
        ...machine,
        status: machine.status as MachineStatus
      }));
      
      setMachines(machinesWithCorrectStatus);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };
  
  // Request machine assistance
  const requestMachineAssistance = async (machineId: string, issue: string) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Dados do cliente não encontrados.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Create a support conversation
      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          client_id: clientId,
          subject: `Assistência para máquina - ${machineId}`
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Add the first message with the issue
        const { error: msgError } = await supabase
          .from('support_messages')
          .insert({
            conversation_id: data[0].id,
            user_id: user!.id,
            message: `Solicitação de assistência para máquina: ${issue}`
          });
        
        if (msgError) throw msgError;
        
        toast({
          title: "Solicitação enviada",
          description: "Sua solicitação de assistência foi registrada. Um técnico entrará em contato em breve."
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error requesting machine assistance:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua solicitação.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Request supplies (receipt paper)
  const requestSupplies = async (machineId: string, quantity: number) => {
    if (!clientId) {
      toast({
        title: "Erro",
        description: "Dados do cliente não encontrados.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Create a support conversation for supplies
      const { data, error } = await supabase
        .from('support_conversations')
        .insert({
          client_id: clientId,
          subject: `Solicitação de Bobinas - ${machineId}`
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        // Add the first message with the supplies request
        const { error: msgError } = await supabase
          .from('support_messages')
          .insert({
            conversation_id: data[0].id,
            user_id: user!.id,
            message: `Solicitação de ${quantity} bobinas para a máquina ${machineId}.`
          });
        
        if (msgError) throw msgError;
        
        toast({
          title: "Solicitação enviada",
          description: `Sua solicitação de ${quantity} bobinas foi registrada e será processada em breve.`
        });
        
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Error requesting supplies:", error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível enviar sua solicitação.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const cid = await fetchClientId();
      if (cid) {
        await fetchMachines(cid);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial data load
  useEffect(() => {
    if (user) {
      fetchData();
      
      // Set up realtime subscription for machine updates
      const channel = supabase
        .channel('machines-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'machines',
            filter: clientId ? `client_id=eq.${clientId}` : undefined
          },
          (payload) => {
            console.log('Machine update:', payload);
            fetchData();
            
            // Show notification for status changes
            if (payload.eventType === 'UPDATE') {
              const newData = payload.new as Machine;
              const oldData = payload.old as Machine;
              
              if (newData.status !== oldData.status) {
                const statusMessages: Record<MachineStatus, string> = {
                  [MachineStatus.ACTIVE]: "Máquina ativada com sucesso.",
                  [MachineStatus.INACTIVE]: "Máquina desativada.",
                  [MachineStatus.MAINTENANCE]: "Máquina em manutenção.",
                };
                
                toast({
                  title: "Status atualizado",
                  description: statusMessages[newData.status] || "Status da máquina atualizado."
                });
              }
            }
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, clientId]);
  
  return {
    machines,
    isLoading,
    requestMachineAssistance,
    requestSupplies,
    refreshData: fetchData
  };
};
