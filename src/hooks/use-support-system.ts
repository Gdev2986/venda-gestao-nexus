
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { 
  getSupportTickets, 
  getTicketById, 
  createSupportTicket, 
  updateSupportTicket,
  getTicketMessages,
  sendTicketMessage
} from "@/services/support-api";
import { SupportTicket, SupportMessage, CreateTicketParams } from "@/types/support.types";
import { useToast } from "@/hooks/use-toast";

export const useSupportSystem = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load tickets
  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getSupportTickets();
      if (error) throw error;
      
      // Filter tickets based on user role
      let filteredTickets = data || [];
      if (userRole === "CLIENT") {
        filteredTickets = filteredTickets.filter(ticket => ticket.client_id === user?.id);
      }
      
      setTickets(filteredTickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os chamados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load messages for selected ticket
  const loadMessages = async (ticketId: string) => {
    try {
      const { data, error } = await getTicketMessages(ticketId);
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Create new ticket - return void to match expected interface
  const createTicket = async (ticketData: CreateTicketParams): Promise<void> => {
    setIsCreating(true);
    try {
      const { data, error } = await createSupportTicket(ticketData);
      if (error) throw error;
      
      await loadTickets();
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o chamado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Send message - removed attachments parameter
  const sendMessage = async (ticketId: string, message: string) => {
    try {
      const { data, error } = await sendTicketMessage(ticketId, message);
      if (error) throw error;
      
      await loadMessages(ticketId);
      return data;
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Update ticket status
  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const { data, error } = await updateSupportTicket(ticketId, { status: status as any });
      if (error) throw error;
      
      await loadTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: status as any });
      }
      
      toast({
        title: "Sucesso",
        description: "Status do chamado atualizado",
      });
      
      return data;
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o chamado",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to ticket changes
    const ticketChannel = supabase
      .channel("support_tickets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_requests",
        },
        () => {
          loadTickets();
        }
      )
      .subscribe();

    // Subscribe to message changes
    const messageChannel = supabase
      .channel("support_messages")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_messages",
        },
        (payload) => {
          if (selectedTicket && payload.new && (payload.new as any).conversation_id === selectedTicket.id) {
            loadMessages(selectedTicket.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ticketChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, selectedTicket]);

  // Load tickets on mount
  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    setSelectedTicket,
    loadTickets,
    loadMessages,
    createTicket,
    sendMessage,
    updateTicketStatus
  };
};
