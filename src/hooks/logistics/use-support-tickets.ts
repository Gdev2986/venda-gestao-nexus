
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getSupportTickets, 
  updateSupportTicket,
  getTicketMessages,
  sendTicketMessage
} from "@/services/support-api";
import { SupportTicket, SupportMessage } from "@/types/support.types";

interface UseSupportTicketsReturn {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  messages: SupportMessage[];
  isLoading: boolean;
  error: string | null;
  createTicket: (ticketData: Partial<SupportTicket>) => Promise<void>;
  updateTicket: (ticketId: string, updates: Partial<SupportTicket>) => Promise<void>;
  deleteTicket: (ticketId: string) => Promise<void>;
  setSelectedTicket: (ticket: SupportTicket | null) => void;
  loadMessages: (ticketId: string) => Promise<void>;
  sendMessage: (ticketId: string, message: string) => Promise<void>;
  refreshTickets: () => Promise<void>;
}

export const useSupportTickets = (): UseSupportTicketsReturn => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load all tickets
  const loadTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await getSupportTickets();
      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar tickets";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for a ticket
  const loadMessages = async (ticketId: string) => {
    try {
      const { data, error } = await getTicketMessages(ticketId);
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao carregar mensagens";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Create ticket
  const createTicket = async (ticketData: Partial<SupportTicket>) => {
    try {
      // Only include fields that exist in the database
      const cleanTicketData = {
        description: ticketData.description || "",
        client_id: ticketData.client_id || "",
        type: ticketData.type,
        priority: ticketData.priority,
        status: ticketData.status,
        scheduled_date: ticketData.scheduled_date
      };

      await updateSupportTicket("new", cleanTicketData);
      await loadTickets();
      
      toast({
        title: "Sucesso",
        description: "Ticket criado com sucesso",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar ticket";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Update ticket
  const updateTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
    try {
      // Only include fields that exist in the database
      const cleanUpdates = {
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        type: updates.type,
        technician_id: updates.technician_id,
        resolution: updates.resolution,
        scheduled_date: updates.scheduled_date
      };

      await updateSupportTicket(ticketId, cleanUpdates);
      await loadTickets();
      
      toast({
        title: "Sucesso",
        description: "Ticket atualizado com sucesso",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar ticket";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Delete ticket
  const deleteTicket = async (ticketId: string) => {
    try {
      // Implementation for deleting ticket would go here
      await loadTickets();
      
      toast({
        title: "Sucesso",
        description: "Ticket excluído com sucesso",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao excluir ticket";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Send message
  const sendMessage = async (ticketId: string, message: string) => {
    try {
      await sendTicketMessage(ticketId, message);
      await loadMessages(ticketId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao enviar mensagem";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Refresh tickets
  const refreshTickets = async () => {
    await loadTickets();
  };

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    error,
    createTicket,
    updateTicket,
    deleteTicket,
    setSelectedTicket,
    loadMessages,
    sendMessage,
    refreshTickets,
  };
};
