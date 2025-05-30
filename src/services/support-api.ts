
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportMessage, SupportConversation, CreateTicketParams } from "@/types/support.types";

// Get all support tickets with client information
export const getSupportTickets = async () => {
  const { data, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};

// Get a specific ticket by ID
export const getTicketById = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('support_requests')
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .eq('id', ticketId)
    .single();

  return { data, error };
};

// Create a new support ticket
export const createSupportTicket = async (ticketData: CreateTicketParams) => {
  const { data, error } = await supabase
    .from('support_requests')
    .insert({
      title: ticketData.description,
      description: ticketData.description,
      client_id: ticketData.client_id,
      type: ticketData.type,
      priority: ticketData.priority,
      status: 'PENDING'
    })
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .single();

  return { data, error };
};

// Update support ticket
export const updateSupportTicket = async (ticketId: string, updates: Partial<SupportTicket>) => {
  const { data, error } = await supabase
    .from('support_requests')
    .update(updates)
    .eq('id', ticketId)
    .select(`
      *,
      client:client_id (
        business_name
      )
    `)
    .single();

  return { data, error };
};

// Get conversation for a ticket
export const getTicketConversation = async (ticketId: string) => {
  const { data, error } = await supabase
    .from('support_conversations')
    .select('*')
    .eq('support_request_id', ticketId)
    .single();

  return { data, error };
};

// Get messages for a conversation
export const getTicketMessages = async (ticketId: string) => {
  // First get the conversation for this ticket
  const { data: conversation, error: convError } = await getTicketConversation(ticketId);
  
  if (convError || !conversation) {
    return { data: [], error: convError };
  }

  const { data, error } = await supabase
    .from('support_messages')
    .select(`
      *,
      user:user_id (
        name,
        email
      )
    `)
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true });

  return { data, error };
};

// Send a message in a ticket conversation
export const sendTicketMessage = async (ticketId: string, message: string) => {
  // First get or create conversation for this ticket
  let { data: conversation, error: convError } = await getTicketConversation(ticketId);
  
  if (convError && convError.code === 'PGRST116') {
    // Conversation doesn't exist, it should have been created by trigger
    // Try to get ticket info and create conversation manually
    const { data: ticket, error: ticketError } = await getTicketById(ticketId);
    if (ticketError || !ticket) {
      return { data: null, error: ticketError || new Error('Ticket not found') };
    }

    const { data: newConv, error: createError } = await supabase
      .from('support_conversations')
      .insert({
        support_request_id: ticketId,
        client_id: ticket.client_id,
        subject: ticket.title,
        status: ticket.status
      })
      .select()
      .single();

    if (createError) {
      return { data: null, error: createError };
    }
    
    conversation = newConv;
  } else if (convError) {
    return { data: null, error: convError };
  }

  // Now send the message
  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      conversation_id: conversation.id,
      user_id: (await supabase.auth.getUser()).data.user?.id,
      message: message
    })
    .select(`
      *,
      user:user_id (
        name,
        email
      )
    `)
    .single();

  return { data, error };
};
