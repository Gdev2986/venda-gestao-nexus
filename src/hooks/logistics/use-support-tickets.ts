
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllSupportTickets, 
  getSupportTicketsByStatus, 
  createSupportTicket, 
  updateSupportTicket, 
  getSupportTicketStats,
  SupportTicket,
  SupportTicketStatus,
  SupportTicketCreateParams,
  SupportTicketUpdateParams
} from "@/services/support.service";
import { supabase } from "@/integrations/supabase/client";

interface UseSupportTicketsOptions {
  status?: SupportTicketStatus;
  clientId?: string;
  initialFetch?: boolean;
  enableRealtime?: boolean;
}

export function useSupportTickets(options: UseSupportTicketsOptions = {}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data: SupportTicket[];
      
      if (options.status) {
        data = await getSupportTicketsByStatus(options.status);
      } else {
        data = await getAllSupportTickets();
      }

      // Filter by client if needed
      if (options.clientId) {
        data = data.filter(ticket => ticket.client_id === options.clientId);
      }

      setTickets(data);
      
      // Fetch stats if needed
      if (!options.status && !options.clientId) {
        const statsData = await getSupportTicketStats();
        setStats(statsData);
      }
    } catch (err: any) {
      setError(err);
      console.error("Error fetching support tickets:", err);
      toast({
        title: "Error",
        description: "Failed to fetch support tickets data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTicket = async (ticketData: SupportTicketCreateParams) => {
    try {
      const newTicket = await createSupportTicket(ticketData);
      toast({
        title: "Support ticket created",
        description: "The support ticket has been created successfully",
      });
      return newTicket;
    } catch (err: any) {
      console.error("Error creating support ticket:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create support ticket",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateTicket = async (id: string, ticketData: SupportTicketUpdateParams) => {
    try {
      const updatedTicket = await updateSupportTicket(id, ticketData);
      toast({
        title: "Support ticket updated",
        description: "The support ticket has been updated successfully",
      });
      return updatedTicket;
    } catch (err: any) {
      console.error("Error updating support ticket:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update support ticket",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Initial fetch
  useEffect(() => {
    if (options.initialFetch !== false) {
      fetchTickets();
    }
  }, [options.status, options.clientId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!options.enableRealtime) return;

    const channel = supabase
      .channel("support-ticket-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => {
          // Refresh data when any change occurs
          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.enableRealtime, options.status, options.clientId]);

  return {
    tickets,
    stats,
    isLoading,
    error,
    fetchTickets,
    addTicket,
    updateTicket
  };
}
