
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { 
  getTickets, 
  getClientTickets, 
  createTicket, 
  updateTicket 
} from "@/services/support/ticket-api";
import { getMessages } from "@/services/support/message-api";
import { SupportTicket, SupportMessage, CreateTicketParams, TicketStatus } from "@/types/support.types";

export const useSupportSystem = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [clientId, setClientId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // Load client ID for client users
  const loadClientId = useCallback(async () => {
    if (!user?.id) return;

    try {
      const { data: clientAccess } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (clientAccess) {
        setClientId(clientAccess.client_id);
      }
    } catch (error) {
      console.error('Erro ao carregar client_id:', error);
    }
  }, [user?.id]);

  // Load tickets based on user role
  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      let result;
      
      if (user?.role === 'CLIENT' && clientId) {
        result = await getClientTickets(clientId);
      } else {
        result = await getTickets();
      }

      if (result.error) throw result.error;
      setTickets(result.data || []);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os tickets",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.role, clientId, toast]);

  // Load messages for a specific ticket - now legacy, real-time hook handles this
  const loadMessages = useCallback(async (ticketId: string, forceReload = false) => {
    try {
      const { data, error } = await getMessages(ticketId);
      if (error) throw error;
      
      // Ensure messages have is_read property
      const messagesWithReadStatus = (data || []).map(msg => ({
        ...msg,
        is_read: msg.is_read ?? false
      }));
      
      setMessages(messagesWithReadStatus);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as mensagens",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Create new ticket
  const createTicket = useCallback(async (ticketData: CreateTicketParams) => {
    setIsCreating(true);
    try {
      const { data, error } = await createTicket(ticketData);
      if (error) throw error;
      
      await loadTickets(); // Refresh tickets list
      
      toast({
        title: "Sucesso",
        description: "Ticket criado com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o ticket",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  }, [loadTickets, toast]);

  // Update ticket status
  const updateTicketStatus = useCallback(async (ticketId: string, status: string) => {
    try {
      const { data, error } = await updateTicket(ticketId, { status: status as TicketStatus });
      if (error) throw error;
      
      await loadTickets(); // Refresh tickets list
      
      toast({
        title: "Sucesso",
        description: "Status do ticket atualizado",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao atualizar ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o ticket",
        variant: "destructive"
      });
    }
  }, [loadTickets, toast]);

  // Assign ticket to technician
  const assignTicket = useCallback(async (ticketId: string, technicianId: string) => {
    try {
      const { data, error } = await updateTicket(ticketId, { 
        assigned_to: technicianId,
        status: TicketStatus.IN_PROGRESS
      });
      if (error) throw error;
      
      await loadTickets(); // Refresh tickets list
      
      toast({
        title: "Sucesso",
        description: "Ticket atribuído com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error('Erro ao atribuir ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o ticket",
        variant: "destructive"
      });
    }
  }, [loadTickets, toast]);

  // Legacy send message function - now handled by real-time hook
  const sendMessage = useCallback(async (ticketId: string, message: string) => {
    // This is now a legacy function, real-time chat handles sending
    console.warn('sendMessage called on legacy hook, use useSupportChatRealtime instead');
  }, []);

  // Load client ID and tickets on mount
  useEffect(() => {
    if (user?.id) {
      loadClientId();
    }
  }, [user?.id, loadClientId]);

  useEffect(() => {
    if (user?.id && (user.role !== 'CLIENT' || clientId)) {
      loadTickets();
    }
  }, [user?.id, user?.role, clientId, loadTickets]);

  return {
    tickets,
    selectedTicket,
    messages, // Legacy - use useSupportChatRealtime for real-time messages
    isLoading,
    isCreating,
    clientId,
    isSubscribed, // Legacy - managed by real-time hook now
    setSelectedTicket,
    loadMessages, // Legacy - use useSupportChatRealtime
    createTicket,
    updateTicketStatus,
    assignTicket,
    sendMessage, // Legacy - use useSupportChatRealtime
    refreshTickets: loadTickets
  };
};
