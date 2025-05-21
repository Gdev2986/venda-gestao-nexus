
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage, MessageData } from "./types";

/**
 * Get messages for a specific ticket
 */
export async function getTicketMessages(ticketId: string): Promise<SupportMessage[]> {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select(`
        *,
        user:user_id(*)
      `)
      .eq('conversation_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Transform data to match SupportMessage interface
    const messages = (data || []).map(msg => {
      // Initialize default user data
      const userObj = {
        id: '',
        name: '',
        role: ''
      };
      
      // Safely access user properties
      if (msg.user && typeof msg.user === 'object') {
        const userAny = msg.user as any;
        
        if (userAny && !userAny.error) {
          userObj.id = userAny.id || '';
          userObj.name = userAny.name || '';
          userObj.role = userAny.role || '';
        }
      }
      
      // Return properly formatted message object
      return {
        id: msg.id,
        ticket_id: msg.conversation_id, // Map conversation_id to ticket_id
        user_id: msg.user_id,
        message: msg.message,
        created_at: msg.created_at,
        user: userObj
      };
    });

    return messages;
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    return [];
  }
}

/**
 * Add a new message to a ticket
 */
export async function addMessage(message: MessageData) {
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .insert({
        conversation_id: message.ticket_id,  // Map ticket_id to conversation_id
        user_id: message.user_id,
        message: message.message
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error adding support message:", error);
    throw error;
  }
}
