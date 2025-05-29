
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
  const [userClientId, setUserClientId] = useState<string | null>(null);

  // Get the client ID for the current user
  const getUserClientId = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      console.log("Getting client ID for user:", user.id);
      const { data, error } = await supabase
        .from("user_client_access")
        .select("client_id")
        .eq("user_id", user.id)
        .single();
      
      if (error) {
        console.error("Error getting user client ID:", error);
        return null;
      }
      
      console.log("Found client ID:", data?.client_id);
      return data?.client_id || null;
    } catch (error) {
      console.error("Error getting user client ID:", error);
      return null;
    }
  };

  // Load user's client ID on mount
  useEffect(() => {
    if (user && userRole === "CLIENT") {
      getUserClientId().then(setUserClientId);
    }
  }, [user, userRole]);

  // Load tickets
  const loadTickets = async () => {
    setIsLoading(true);
    try {
      console.log("Loading tickets for user role:", userRole);
      const { data, error } = await getSupportTickets();
      if (error) throw error;
      
      // Filter tickets based on user role
      let filteredTickets = data || [];
      if (userRole === "CLIENT") {
        const clientId = userClientId || await getUserClientId();
        console.log("Filtering tickets for client ID:", clientId);
        if (clientId) {
          filteredTickets = filteredTickets.filter(ticket => ticket.client_id === clientId);
        } else {
          filteredTickets = [];
          console.warn("No client ID found for user, showing empty ticket list");
        }
      }
      
      console.log("Loaded tickets:", filteredTickets.length);
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
      console.log("Loading messages for ticket:", ticketId);
      const { data, error } = await getTicketMessages(ticketId);
      if (error) throw error;
      console.log("Loaded messages:", data?.length || 0);
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Create new ticket - return void to match expected interface
  const createTicket = async (ticketData: CreateTicketParams): Promise<void> => {
    setIsCreating(true);
    try {
      if (!user) {
        throw new Error("Usuário não autenticado");
      }

      // Get the client ID for the current user
      const clientId = userClientId || await getUserClientId();
      if (!clientId) {
        console.error("No client ID found for user:", user.id);
        throw new Error("Seu usuário não está associado a nenhum cliente. Entre em contato com o administrador para resolver esta questão.");
      }

      console.log("Creating ticket with client ID:", clientId);
      
      // Create ticket with the correct client_id
      const ticketWithClientId = {
        ...ticketData,
        client_id: clientId
      };

      const { data, error } = await createSupportTicket(ticketWithClientId);
      if (error) {
        console.error("Error from createSupportTicket:", error);
        throw error;
      }
      
      console.log("Ticket created successfully:", data);
      await loadTickets();
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Não foi possível criar o chamado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Send message
  const sendMessage = async (ticketId: string, message: string) => {
    try {
      console.log("Sending message to ticket:", ticketId);
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
      console.log("Updating ticket status:", ticketId, status);
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

    console.log("Setting up real-time subscriptions for user:", user.id);

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
          console.log("Ticket change detected, reloading tickets");
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
          console.log("Message change detected:", payload);
          if (selectedTicket && payload.new && (payload.new as any).conversation_id === selectedTicket.id) {
            loadMessages(selectedTicket.id);
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscriptions");
      supabase.removeChannel(ticketChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, selectedTicket]);

  // Load tickets on mount
  useEffect(() => {
    if (user) {
      console.log("User loaded, loading tickets");
      loadTickets();
    }
  }, [user, userClientId]);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    userClientId,
    setSelectedTicket,
    loadTickets,
    loadMessages,
    createTicket,
    sendMessage,
    updateTicketStatus
  };
};
