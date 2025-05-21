
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "./types";

// API response interface to match hook expectations
interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Get all messages for a conversation
export const getMessages = async (conversationId: string): Promise<ApiResponse<SupportMessage[]>> => {
  try {
    const { data, error } = await supabase
      .from("support_messages")
      .select(`
        *,
        user:user_id (
          id, name, role
        )
      `)
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return { data: null, error };
    }

    // Make sure we're adapting the response to match our expected SupportMessage interface
    return { 
      data: data.map((msg: any) => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        ticket_id: msg.conversation_id, // Map conversation_id to ticket_id for compatibility
        user_id: msg.user_id,
        message: msg.message,
        created_at: msg.created_at,
        is_read: msg.is_read,
        user: msg.user
      })) as SupportMessage[],
      error: null
    };
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Get messages for a ticket - alias for getMessages
export const getTicketMessages = async (ticketId: string): Promise<ApiResponse<SupportMessage[]>> => {
  return getMessages(ticketId);
};

// Send a new message
export const sendMessage = async (
  conversationId: string,
  userId: string,
  message: string
): Promise<ApiResponse<SupportMessage>> => {
  try {
    const { data, error } = await supabase
      .from("support_messages")
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        message
      })
      .select()
      .single();

    if (error) {
      console.error("Error sending message:", error);
      return { data: null, error };
    }

    return {
      data: {
        id: data.id,
        conversation_id: data.conversation_id,
        ticket_id: data.conversation_id, // Map for compatibility
        user_id: data.user_id,
        message: data.message,
        created_at: data.created_at,
        is_read: data.is_read
      } as SupportMessage,
      error: null
    };
  } catch (error) {
    console.error("Failed to send message:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Add a message to a ticket - alias for sendMessage
export const addTicketMessage = async (
  ticketId: string,
  userId: string,
  message: string
): Promise<ApiResponse<SupportMessage>> => {
  return sendMessage(ticketId, userId, message);
};

// Mark messages as read
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<ApiResponse<void>> => {
  try {
    const { error } = await supabase
      .from("support_messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("user_id", userId);

    if (error) {
      console.error("Error marking messages as read:", error);
      return { data: null, error };
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};
