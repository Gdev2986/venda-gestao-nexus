
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "./types";
import { createMessageNotification } from "./notification-api";

// Helper function to transform message data consistently
function messageTransformer(msg: any): SupportMessage {
  const userObj = {
    id: '',
    name: '',
    role: ''
  };
  
  // Safely access user properties
  if (msg.user && typeof msg.user === 'object') {
    const userAny = msg.user;
    if (userAny && !userAny.error) {
      userObj.id = userAny.id || '';
      userObj.name = userAny.name || '';
      userObj.role = userAny.role || '';
    }
  }
  
  // Ensure we have a ticket_id property, falling back to conversation_id if needed
  const messageTicketId = msg.ticket_id || msg.conversation_id;
  
  return {
    id: msg.id,
    ticket_id: messageTicketId,
    user_id: msg.user_id,
    message: msg.message,
    created_at: msg.created_at,
    user: userObj
  };
}

// Get messages for a ticket
export async function getTicketMessages(ticketId: string): Promise<{ data: SupportMessage[] | null, error: any }> {
  // Fix: Simplify the code to avoid excessive type instantiation
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('*, user:user_id(id, name, role)')
      .eq('conversation_id', ticketId)
      .order('created_at', { ascending: true });
      
    if (error) {
      return { data: null, error };
    }
    
    if (!data || data.length === 0) {
      // If no results, it could be using a different column name
      // This is a fallback mechanism for backward compatibility
      const { data: altData, error: altError } = await supabase
        .from('support_messages')
        .select('*, user:user_id(id, name, role)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
        
      if (altError) return { data: null, error: altError };
        
      if (!altData || altData.length === 0) {
        return { data: [], error: null };
      }
      
      // Process alternative response
      const messages = altData.map(msg => messageTransformer(msg));
      return { data: messages, error: null };
    }
    
    // Process standard response
    const messages = data.map(msg => messageTransformer(msg));
    return { data: messages, error: null };
  } catch (err) {
    console.error("Error in getTicketMessages:", err);
    return { data: null, error: err };
  }
}

// Add a message to a ticket
export async function addTicketMessage(ticketId: string, userId: string, message: string): Promise<{ data: any, error: any }> {
  // Always use conversation_id for consistency
  const { data, error } = await supabase
    .from('support_messages')
    .insert({
      conversation_id: ticketId,
      user_id: userId,
      message: message
    } as any)
    .select();
  
  if (!error) {
    // Also update the ticket's updated_at timestamp
    await supabase
      .from('support_requests')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);
      
    // Create notification for the message
    await createMessageNotification(ticketId, userId, message);
  }

  return { data, error };
}
