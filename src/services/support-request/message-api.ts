
import { supabase } from "@/integrations/supabase/client";

// GET messages for a specific ticket
export const getTicketMessages = async (ticketId: string) => {
  return await supabase
    .from("support_messages")
    .select("*")
    .eq("conversation_id", ticketId)
    .order("created_at", { ascending: true });
};

// ADD a new message
export const addMessage = async (ticketId: string, userId: string, message: string) => {
  return await supabase
    .from("support_messages")
    .insert({
      conversation_id: ticketId,
      user_id: userId,
      message,
      is_read: false
    })
    .select()
    .single();
};

// MARK messages as read
export const markMessagesAsRead = async (ticketId: string, userId: string) => {
  return await supabase
    .from("support_messages")
    .update({ is_read: true })
    .eq("conversation_id", ticketId)
    .neq("user_id", userId);
};
