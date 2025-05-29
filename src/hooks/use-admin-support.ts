
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { SupportTicket, SupportRequestStatus } from "@/types/support.types";
import { useToast } from "@/hooks/use-toast";

export function useAdminSupport() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("support_requests")
        .select(`
          *,
          client:clients!client_id (
            id,
            business_name,
            contact_name,
            phone,
            email
          ),
          machine:machines!machine_id (
            id,
            serial_number,
            model
          ),
          assigned_user:profiles!assigned_to (
            id,
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedTickets: SupportTicket[] = (data || []).map(item => ({
        id: item.id,
        client_id: item.client_id,
        technician_id: item.technician_id,
        machine_id: item.machine_id,
        assigned_to: item.assigned_to,
        type: item.type,
        status: item.status,
        priority: item.priority,
        scheduled_date: item.scheduled_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
        title: item.title,
        description: item.description,
        resolution: item.resolution,
        attachments: item.attachments || [],
        client: Array.isArray(item.client) && item.client.length > 0 ? item.client[0] : item.client,
        machine: Array.isArray(item.machine) && item.machine.length > 0 ? item.machine[0] : item.machine,
        assigned_user: Array.isArray(item.assigned_user) && item.assigned_user.length > 0 ? item.assigned_user[0] : item.assigned_user
      }));

      setTickets(formattedTickets);
    } catch (err: any) {
      console.error("Error fetching admin support tickets:", err);
      setError(err.message || "Erro ao carregar chamados");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: SupportRequestStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("support_requests")
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: "O status do chamado foi atualizado com sucesso"
      });

      fetchTickets();
      return true;
    } catch (err: any) {
      console.error("Error updating ticket status:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Erro ao atualizar status"
      });
      return false;
    }
  };

  const assignTicket = async (ticketId: string, assignedTo: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("support_requests")
        .update({ 
          assigned_to: assignedTo,
          status: SupportRequestStatus.IN_PROGRESS,
          updated_at: new Date().toISOString()
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Chamado atribuído",
        description: "O chamado foi atribuído com sucesso"
      });

      fetchTickets();
      return true;
    } catch (err: any) {
      console.error("Error assigning ticket:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Erro ao atribuir chamado"
      });
      return false;
    }
  };

  const resolveTicket = async (ticketId: string, resolution: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from("support_requests")
        .update({ 
          status: SupportRequestStatus.COMPLETED,
          resolution,
          updated_at: new Date().toISOString()
        })
        .eq("id", ticketId);

      if (error) throw error;

      toast({
        title: "Chamado resolvido",
        description: "O chamado foi marcado como resolvido"
      });

      fetchTickets();
      return true;
    } catch (err: any) {
      console.error("Error resolving ticket:", err);
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message || "Erro ao resolver chamado"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin_support_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_requests'
        },
        () => {
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    tickets,
    isLoading,
    error,
    updateTicketStatus,
    assignTicket,
    resolveTicket,
    refetch: fetchTickets
  };
}
