
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { 
  getTickets, 
  getClientTickets, 
  createTicket as createTicketAPI, 
  updateTicket 
} from "@/services/support/ticket-api";
import { getMessages, sendMessage as sendMessageAPI } from "@/services/support/message-api";
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

  // Load messages for a specific ticket
  const loadMessages = useCallback(async (ticketId: string, forceReload = false) => {
    try {
      const { data, error } = await getMessages(ticketId);
      if (error) throw error;
      
      setMessages(data || []);
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
  const createTicket = useCallback(async (ticketData: CreateTicketParams): Promise<void> => {
    setIsCreating(true);
    try {
      const { data, error } = await createTicketAPI(ticketData);
      if (error) throw error;
      
      await loadTickets(); // Refresh tickets list
      
      toast({
        title: "Sucesso",
        description: "Ticket criado com sucesso",
      });
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
  const updateTicketStatus = useCallback(async (ticketId: string, status: string): Promise<void> => {
    try {
      const { data, error } = await updateTicket(ticketId, { status: status as TicketStatus });
      if (error) throw error;
      
      await loadTickets(); // Refresh tickets list
      
      toast({
        title: "Sucesso",
        description: "Status do ticket atualizado",
      });
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
  const assignTicket = useCallback(async (ticketId: string, technicianId: string): Promise<void> => {
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
    } catch (error) {
      console.error('Erro ao atribuir ticket:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o ticket",
        variant: "destructive"
      });
    }
  }, [loadTickets, toast]);

  // Send message function
  const sendMessage = useCallback(async (ticketId: string, message: string) => {
    try {
      const { data, error } = await sendMessageAPI(ticketId, message);
      if (error) throw error;
      
      // Reload messages to show the new one
      await loadMessages(ticketId);
      
      toast({
        title: "Sucesso",
        description: "Mensagem enviada",
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive"
      });
    }
  }, [loadMessages, toast]);

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
    messages,
    isLoading,
    isCreating,
    clientId,
    isSubscribed,
    setSelectedTicket,
    loadMessages,
    createTicket,
    updateTicketStatus,
    assignTicket,
    sendMessage,
    refreshTickets: loadTickets
  };
};
