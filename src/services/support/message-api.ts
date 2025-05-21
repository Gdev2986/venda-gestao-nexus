
import { supabase } from "@/lib/supabase";
import { SupportMessage } from "./types";

// Get all messages for a conversation
export const getMessages = async (conversationId: string): Promise<SupportMessage[]> => {
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
      throw error;
    }

    // Make sure we're adapting the response to match our expected SupportMessage interface
    return data.map((msg: any) => ({
      id: msg.id,
      conversation_id: msg.conversation_id,
      user_id: msg.user_id,
      message: msg.message,
      created_at: msg.created_at,
      is_read: msg.is_read,
      user: msg.user
    })) as SupportMessage[];
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    throw error;
  }
};

// Send a new message
export const sendMessage = async (
  conversationId: string,
  userId: string,
  message: string
): Promise<SupportMessage> => {
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
      throw error;
    }

    return {
      id: data.id,
      conversation_id: data.conversation_id,
      user_id: data.user_id,
      message: data.message,
      created_at: data.created_at,
      is_read: data.is_read
    } as SupportMessage;
  } catch (error) {
    console.error("Failed to send message:", error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from("support_messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("user_id", userId);

    if (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to mark messages as read:", error);
    throw error;
  }
};
