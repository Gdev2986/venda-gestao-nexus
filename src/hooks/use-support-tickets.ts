
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  SupportTicket, 
  SupportMessage, 
  CreateTicketParams,
  UpdateTicketParams
} from "@/types/support.types";
import { 
  getSupportTickets, 
  getSupportTicketById, 
  getClientSupportTickets,
  createSupportTicket,
  updateSupportTicket,
  addTicketMessage, 
  getTicketMessages
} from "@/services/support.service";

interface UseSupportTicketsOptions {
  clientId?: string;
  initialFetch?: boolean;
}

export function useSupportTickets(options: UseSupportTicketsOptions = {}) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch tickets on mount if initialFetch is true
  useEffect(() => {
    if (options.initialFetch !== false) {
      fetchTickets();
    }
  }, [options.clientId]);
  
  // Fetch all tickets or client-specific tickets
  const fetchTickets = async () => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (options.clientId) {
        result = await getClientSupportTickets(options.clientId);
      } else {
        result = await getSupportTickets();
      }
      
      const { data, error } = result;
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTickets(data);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chamados",
        description: error.message || "Não foi possível carregar os chamados",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get a single ticket by ID
  const getTicket = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await getSupportTicketById(id);
      
      if (error) {
        throw error;
      }
      
      setSelectedTicket(data);
      
      // Also fetch messages for this ticket
      await fetchTicketMessages(id);
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao carregar chamado",
        description: error.message || "Não foi possível carregar os detalhes do chamado",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new ticket
  const addTicket = async (params: Omit<CreateTicketParams, 'client_id'> & { client_id?: string }) => {
    setIsSaving(true);
    
    try {
      // If client_id is not provided, try to get it from options
      const clientId = params.client_id || options.clientId;
      
      if (!clientId) {
        throw new Error("ID do cliente é necessário para criar um chamado");
      }
      
      const { data, error } = await createSupportTicket({
        ...params,
        client_id: clientId,
        user_id: user?.id
      });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTickets(prev => [data, ...prev]);
      }
      
      toast({
        title: "Chamado criado",
        description: "Seu chamado foi criado com sucesso",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar chamado",
        description: error.message || "Não foi possível criar o chamado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update an existing ticket
  const updateTicket = async (id: string, updates: UpdateTicketParams) => {
    setIsSaving(true);
    
    try {
      const { data, error } = await updateSupportTicket(id, updates);
      
      if (error) {
        throw error;
      }
      
      // Update the tickets list
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === id ? { ...ticket, ...updates } : ticket
        )
      );
      
      // Update selected ticket if it matches
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({
          ...selectedTicket,
          ...updates
        });
      }
      
      toast({
        title: "Chamado atualizado",
        description: "O chamado foi atualizado com sucesso",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar chamado",
        description: error.message || "Não foi possível atualizar o chamado",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Fetch messages for a ticket
  const fetchTicketMessages = async (ticketId: string) => {
    try {
      const { data, error } = await getTicketMessages(ticketId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setTicketMessages(data);
      }
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao carregar mensagens",
        description: error.message || "Não foi possível carregar as mensagens do chamado",
        variant: "destructive",
      });
      return null;
    }
  };
  
  // Add a message to a ticket
  const sendMessage = async (ticketId: string, message: string) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar autenticado para enviar mensagens",
        variant: "destructive",
      });
      return null;
    }
    
    setIsSaving(true);
    
    try {
      const { data, error } = await addTicketMessage(ticketId, user.id, message);
      
      if (error) {
        throw error;
      }
      
      // Refresh messages
      await fetchTicketMessages(ticketId);
      
      toast({
        title: "Mensagem enviada",
        description: "Sua mensagem foi enviada com sucesso",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message || "Não foi possível enviar sua mensagem",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    tickets,
    selectedTicket,
    ticketMessages,
    isLoading,
    isSaving,
    fetchTickets,
    getTicket,
    addTicket,
    updateTicket,
    fetchTicketMessages,
    sendMessage,
    setSelectedTicket
  };
}
