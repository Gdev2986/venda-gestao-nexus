
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "@/types/support.types";

// Get messages for a ticket
export const getMessages = async (ticketId: string) => {
  // First get the conversation for this ticket
  const { data: conversation, error: convError } = await supabase
    .from('support_conversations')
    .select('*')
    .eq('support_request_id', ticketId)
    .single();
  
  if (convError || !conversation) {
    console.log('No conversation found for ticket:', ticketId);
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
    console.error('Error fetching messages:', error);
    return { data: [], error };
  }

  // Transform the data with simplified null handling
  const transformedData: SupportMessage[] = (data || []).map(item => {
    let userInfo = undefined;
    
    if (item.user && typeof item.user === 'object' && item.user !== null) {
      const user = item.user as { name?: string; email?: string };
      if (user.name || user.email) {
        userInfo = {
          name: user.name || 'Usuário',
          email: user.email || ''
        };
      }
    }

    return {
      id: item.id,
      conversation_id: item.conversation_id,
      user_id: item.user_id,
      message: item.message,
      is_read: item.is_read ?? false,
      created_at: item.created_at,
      user: userInfo
    };
  });

  return { data: transformedData, error: null };
};

// Send a message
export const sendMessage = async (ticketId: string, message: string) => {
  // First get or create conversation for this ticket
  let { data: conversation, error: convError } = await supabase
    .from('support_conversations')
    .select('*')
    .eq('support_request_id', ticketId)
    .single();
  
  if (convError && convError.code === 'PGRST116') {
    // Conversation doesn't exist, create it
    const { data: ticket } = await supabase
      .from('support_requests')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (!ticket) {
      return { data: null, error: new Error('Ticket not found') };
    }

    const { data: newConv, error: createError } = await supabase
      .from('support_conversations')
      .insert({
        support_request_id: ticketId,
        client_id: ticket.client_id,
        subject: ticket.title || 'Support Request',
        status: ticket.status
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return { data: null, error: createError };
    }
    
    conversation = newConv;
  } else if (convError) {
    console.error('Error fetching conversation:', convError);
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
    console.error('Error sending message:', error);
    return { data: null, error };
  }

  // Transform with simplified null handling
  let userInfo = undefined;
  
  if (data.user && typeof data.user === 'object' && data.user !== null) {
    const user = data.user as { name?: string; email?: string };
    if (user.name || user.email) {
      userInfo = {
        name: user.name || 'Usuário',
        email: user.email || ''
      };
    }
  }

  const transformedData: SupportMessage = {
    id: data.id,
    conversation_id: data.conversation_id,
    user_id: data.user_id,
    message: data.message,
    is_read: data.is_read ?? false,
    created_at: data.created_at,
    user: userInfo
  };

  return { data: transformedData, error: null };
};
