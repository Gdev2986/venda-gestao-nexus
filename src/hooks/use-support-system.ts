
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
  const [clientId, setClientId] = useState<string | null>(null);

  // Get client ID for current user
  const fetchClientId = async () => {
    if (!user?.id) {
      console.log('useSupportSystem: No user ID available');
      return;
    }

    try {
      console.log('useSupportSystem: Fetching client access for user:', user.id);
      
      // First check if user has direct client access
      const { data: clientAccess, error: accessError } = await supabase
        .from('user_client_access')
        .select('client_id')
        .eq('user_id', user.id)
        .single();

      if (accessError && accessError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('useSupportSystem: Error fetching client access:', accessError);
        throw accessError;
      }

      if (clientAccess?.client_id) {
        // Verify the client actually exists
        const { data: clientExists, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('id', clientAccess.client_id)
          .single();

        if (clientError && clientError.code !== 'PGRST116') {
          console.error('useSupportSystem: Error verifying client:', clientError);
          throw clientError;
        }

        if (clientExists) {
          console.log('useSupportSystem: Found valid client ID:', clientAccess.client_id);
          setClientId(clientAccess.client_id);
          return;
        }
      }

      // If no client access found, check if user role allows creating tickets without client association
      if (userRole === 'ADMIN' || userRole === 'LOGISTICS') {
        console.log('useSupportSystem: Admin/Logistics user - no client association required');
        setClientId(null);
        return;
      }

      // For regular users without client association, we can't create tickets
      console.log('useSupportSystem: No client association found for user');
      setClientId(null);
      
    } catch (err) {
      console.error('useSupportSystem: Error in fetchClientId:', err);
      setClientId(null);
      toast({
        title: "Erro",
        description: "Não foi possível verificar suas permissões. Entre em contato com o suporte.",
        variant: "destructive",
      });
    }
  };

  // Load tickets
  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getSupportTickets();
      if (error) throw error;
      
      // Filter tickets based on user role
      let filteredTickets = data || [];
      if (userRole === "CLIENT" && clientId) {
        filteredTickets = filteredTickets.filter(ticket => ticket.client_id === clientId);
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
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive",
      });
      throw new Error('Usuário não autenticado');
    }

    console.log('useSupportSystem: Creating ticket with data:', ticketData);
    
    // Validate client_id if provided
    if (ticketData.client_id) {
      try {
        const { data: clientExists, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('id', ticketData.client_id)
          .single();

        if (clientError || !clientExists) {
          throw new Error('Cliente não encontrado. Verifique suas permissões.');
        }
      } catch (err) {
        console.error('useSupportSystem: Client validation failed:', err);
        toast({
          title: "Erro",
          description: "Cliente não encontrado. Entre em contato com o administrador.",
          variant: "destructive",
        });
        throw err;
      }
    } else if (userRole === 'CLIENT') {
      // Client users must have a valid client_id
      toast({
        title: "Erro",
        description: "Você não está associado a um cliente. Entre em contato com o administrador.",
        variant: "destructive",
      });
      throw new Error('Cliente não associado');
    }

    setIsCreating(true);
    try {
      // Use direct Supabase insert with proper authentication context
      const { data, error } = await supabase
        .from('support_requests')
        .insert({
          title: ticketData.description, // Use description as title since that's what we have
          description: ticketData.description,
          client_id: ticketData.client_id,
          type: ticketData.type.toString() as "MAINTENANCE" | "INSTALLATION" | "OTHER" | "REPLACEMENT" | "SUPPLIES" | "REMOVAL",
          priority: ticketData.priority.toString() as "LOW" | "MEDIUM" | "HIGH",
          status: "PENDING" as "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED"
        })
        .select()
        .single();

      if (error) {
        console.error('useSupportSystem: Error from direct insert:', error);
        throw error;
      }
      
      await loadTickets();
      toast({
        title: "Sucesso",
        description: "Chamado criado com sucesso",
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Não foi possível criar o chamado";
      if (error instanceof Error) {
        if (error.message.includes('foreign key constraint')) {
          errorMessage = "Erro de associação com cliente. Entre em contato com o administrador.";
        } else if (error.message.includes('permission') || error.message.includes('row-level security')) {
          errorMessage = "Você não tem permissão para criar chamados. Entre em contato com o administrador.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
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

  // Load client ID and tickets on mount
  useEffect(() => {
    if (user) {
      fetchClientId().then(() => {
        loadTickets();
      });
    }
  }, [user, userRole]);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    clientId,
    setSelectedTicket,
    loadTickets,
    loadMessages,
    createTicket,
    sendMessage,
    updateTicketStatus
  };
};
