
import { supabase } from "@/integrations/supabase/client";
import { SupportTicket, SupportMessage, SupportConversation, CreateTicketParams, TicketType, TicketPriority, TicketStatus } from "@/types/support.types";

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

  if (error) {
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket[] = (data || []).map(item => ({
    id: item.id,
    client_id: item.client_id,
    technician_id: item.technician_id,
    title: item.title,
    description: item.description,
    type: item.type as TicketType,
    priority: item.priority as TicketPriority,
    status: item.status as TicketStatus,
    scheduled_date: item.scheduled_date,
    created_at: item.created_at,
    updated_at: item.updated_at,
    resolution: item.resolution,
    client: item.client
  }));

  return { data: transformedData, error: null };
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

  if (error) {
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket = {
    id: data.id,
    client_id: data.client_id,
    technician_id: data.technician_id,
    title: data.title,
    description: data.description,
    type: data.type as TicketType,
    priority: data.priority as TicketPriority,
    status: data.status as TicketStatus,
    scheduled_date: data.scheduled_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    resolution: data.resolution,
    client: data.client
  };

  return { data: transformedData, error: null };
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

  if (error) {
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket = {
    id: data.id,
    client_id: data.client_id,
    technician_id: data.technician_id,
    title: data.title,
    description: data.description,
    type: data.type as TicketType,
    priority: data.priority as TicketPriority,
    status: data.status as TicketStatus,
    scheduled_date: data.scheduled_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    resolution: data.resolution,
    client: data.client
  };

  return { data: transformedData, error: null };
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

  if (error) {
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types
  const transformedData: SupportTicket = {
    id: data.id,
    client_id: data.client_id,
    technician_id: data.technician_id,
    title: data.title,
    description: data.description,
    type: data.type as TicketType,
    priority: data.priority as TicketPriority,
    status: data.status as TicketStatus,
    scheduled_date: data.scheduled_date,
    created_at: data.created_at,
    updated_at: data.updated_at,
    resolution: data.resolution,
    client: data.client
  };

  return { data: transformedData, error: null };
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

  if (error) {
    return { data: [], error };
  }

  // Transform the data to match our TypeScript types with proper null handling
  const transformedData: SupportMessage[] = (data || []).map(item => {
    const userInfo = item.user && typeof item.user === 'object' && 'name' in item.user 
      ? {
          name: item.user.name || 'Usuário',
          email: item.user.email || ''
        }
      : undefined;

    return {
      id: item.id,
      conversation_id: item.conversation_id,
      user_id: item.user_id,
      message: item.message,
      is_read: item.is_read,
      created_at: item.created_at,
      user: userInfo
    };
  });

  return { data: transformedData, error: null };
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

  if (error) {
    return { data: null, error };
  }

  // Transform the data to match our TypeScript types with proper null handling
  const userInfo = data.user && typeof data.user === 'object' && 'name' in data.user 
    ? {
        name: data.user.name || 'Usuário',
        email: data.user.email || ''
      }
    : undefined;

  const transformedData: SupportMessage = {
    id: data.id,
    conversation_id: data.conversation_id,
    user_id: data.user_id,
    message: data.message,
    is_read: data.is_read,
    created_at: data.created_at,
    user: userInfo
  };

  return { data: transformedData, error: null };
};
