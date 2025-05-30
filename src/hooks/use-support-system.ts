import { useState, useEffect, useCallback } from "react";
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
import { SupportTicket, SupportMessage, CreateTicketParams, TicketStatus } from "@/types/support.types";
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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
  const loadTickets = useCallback(async () => {
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
  }, [userRole, clientId, toast]);

  // Fetch conversation ID for a ticket
  const fetchConversationId = useCallback(async (ticketId: string) => {
    try {
      console.log('🔍 Fetching conversation ID for ticket:', ticketId);
      const { data, error } = await supabase
        .from('support_conversations')
        .select('id')
        .eq('support_request_id', ticketId)
        .single();

      if (error) {
        console.error('❌ Error fetching conversation ID:', error);
        return null;
      }

      console.log('✅ Found conversation ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ Error in fetchConversationId:', error);
      return null;
    }
  }, []);

  // Load messages for selected ticket
  const loadMessages = useCallback(async (ticketId: string, forceReload = false) => {
    try {
      console.log('📥 Loading messages for ticket:', ticketId, 'forceReload:', forceReload);
      
      // Get conversation ID first
      const convId = await fetchConversationId(ticketId);
      if (convId) {
        setConversationId(convId);
      }
      
      const { data, error } = await getTicketMessages(ticketId);
      if (error) throw error;
      
      console.log('📨 Loaded', data?.length || 0, 'messages');
      
      // Always update messages when loading, don't check for optimistic updates here
      setMessages(data || []);
    } catch (error) {
      console.error("❌ Error loading messages:", error);
    }
  }, [fetchConversationId]);

  // Add optimistic message update
  const addOptimisticMessage = useCallback((message: string) => {
    if (!user) return null;

    const optimisticMessage: SupportMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId || '',
      user_id: user.id,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
      user: {
        name: user.email?.split('@')[0] || 'Você',
        email: user.email || ''
      }
    };

    console.log('⚡ Adding optimistic message:', optimisticMessage.message.substring(0, 50));
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    
    return optimisticMessage.id;
  }, [user, conversationId]);

  // Remove optimistic message (on error)
  const removeOptimisticMessage = useCallback((tempId: string) => {
    console.log('🗑️ Removing optimistic message:', tempId);
    setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
  }, []);

  // Replace optimistic message with real one
  const replaceOptimisticMessage = useCallback((tempId: string, realMessage: SupportMessage) => {
    console.log('🔄 Replacing optimistic message:', tempId, 'with real:', realMessage.id);
    setMessages(prevMessages => 
      prevMessages.map(msg => msg.id === tempId ? realMessage : msg)
    );
  }, []);

  // Notify admins about new ticket - usando profiles ao invés de auth.users
  const notifyAdminsNewTicket = async (ticketId: string, clientName: string) => {
    try {
      // Get all admin and logistics users from profiles table
      const { data: adminUsers, error } = await supabase
        .from('profiles')
        .select('id')
        .in('role', ['ADMIN', 'LOGISTICS']);

      if (error) {
        console.error('Error fetching admin users:', error);
        return;
      }

      // Create notifications for each admin
      const notifications = adminUsers.map(admin => ({
        user_id: admin.id,
        title: 'Novo Chamado de Suporte',
        message: `Cliente ${clientName} criou um novo chamado de suporte`,
        type: 'SUPPORT' as const,
        data: { ticket_id: ticketId }
      }));

      if (notifications.length > 0) {
        const { error: notifyError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notifyError) {
          console.error('Error creating notifications:', notifyError);
        }
      }
    } catch (error) {
      console.error('Error notifying admins:', error);
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
          .select('id, business_name')
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
      const { data, error } = await createSupportTicket(ticketData);

      if (error) {
        console.error('useSupportSystem: Error creating ticket:', error);
        throw error;
      }
      
      // Notify admins about the new ticket
      if (data && data.client) {
        await notifyAdminsNewTicket(data.id, data.client.business_name);
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

  // Send message with optimistic update
  const sendMessage = async (ticketId: string, message: string) => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    console.log('📤 Sending message for ticket:', ticketId);
    
    // Add optimistic message
    const tempId = addOptimisticMessage(message);
    
    try {
      // Send the message
      const { data, error } = await sendTicketMessage(ticketId, message);
      if (error) throw error;
      
      console.log('✅ Message sent successfully:', data);
      
      // Replace optimistic message with real one
      if (tempId && data) {
        replaceOptimisticMessage(tempId, data);
      }
      
      return data;
    } catch (error) {
      console.error("❌ Error sending message:", error);
      
      // Remove optimistic message on error
      if (tempId) {
        removeOptimisticMessage(tempId);
      }
      
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
      const { data, error } = await updateSupportTicket(ticketId, { status: status as TicketStatus });
      if (error) throw error;
      
      await loadTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: status as TicketStatus });
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

  // Assign ticket to technician
  const assignTicket = async (ticketId: string, technicianId: string) => {
    try {
      const { data, error } = await updateSupportTicket(ticketId, { 
        technician_id: technicianId,
        status: TicketStatus.IN_PROGRESS
      });
      if (error) throw error;
      
      await loadTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ 
          ...selectedTicket, 
          technician_id: technicianId,
          status: TicketStatus.IN_PROGRESS
        });
      }
      
      toast({
        title: "Sucesso",
        description: "Chamado atribuído com sucesso",
      });
      
      return data;
    } catch (error) {
      console.error("Error assigning ticket:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o chamado",
        variant: "destructive",
      });
      throw error;
    }
  };

  // Real-time subscription for tickets
  useEffect(() => {
    if (!user) return;

    console.log('🔄 Setting up ticket subscription');
    
    const ticketChannel = supabase
      .channel("support_tickets_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support_requests",
        },
        (payload) => {
          console.log('📥 Ticket change received:', payload.eventType, payload);
          loadTickets();
        }
      )
      .subscribe((status) => {
        console.log('📡 Ticket subscription status:', status);
      });

    return () => {
      console.log('🧹 Cleaning up ticket subscription');
      supabase.removeChannel(ticketChannel);
    };
  }, [user, loadTickets]);

  // Real-time subscription for messages - completely rewritten
  useEffect(() => {
    if (!user || !conversationId) {
      console.log('⏸️ Skipping message subscription - missing user or conversationId:', { user: !!user, conversationId });
      setIsSubscribed(false);
      return;
    }

    console.log('🔄 Setting up message subscription for conversation:', conversationId);
    
    const messageChannel = supabase
      .channel(`messages_conv_${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "support_messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('📨 New message received via subscription:', payload);
          
          const newMessage = payload.new as SupportMessage;
          
          // Only add if it's not from current user to avoid duplicates from optimistic updates
          if (newMessage.user_id !== user.id) {
            console.log('✅ Adding message from another user:', newMessage.message.substring(0, 50));
            
            setMessages(prevMessages => {
              // Check if message already exists
              const exists = prevMessages.some(msg => msg.id === newMessage.id);
              if (exists) {
                console.log('⏭️ Message already exists, skipping');
                return prevMessages;
              }
              
              console.log('📝 Adding new message to state');
              return [...prevMessages, newMessage];
            });
          } else {
            console.log('⏭️ Skipping own message to avoid duplicate');
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public", 
          table: "support_messages",
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          console.log('🔄 Message updated via subscription:', payload);
          
          const updatedMessage = payload.new as SupportMessage;
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .subscribe((status) => {
        console.log('📡 Message subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to messages for conversation:', conversationId);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Error subscribing to messages');
          setIsSubscribed(false);
        }
      });

    return () => {
      console.log('🧹 Cleaning up message subscription for conversation:', conversationId);
      setIsSubscribed(false);
      supabase.removeChannel(messageChannel);
    };
  }, [user, conversationId]);

  // Load client ID and tickets on mount
  useEffect(() => {
    if (user) {
      fetchClientId().then(() => {
        loadTickets();
      });
    }
  }, [user, userRole, loadTickets]);

  return {
    tickets,
    selectedTicket,
    messages,
    isLoading,
    isCreating,
    clientId,
    isSubscribed,
    setSelectedTicket,
    loadTickets,
    loadMessages,
    createTicket,
    sendMessage,
    updateTicketStatus,
    assignTicket
  };
};
