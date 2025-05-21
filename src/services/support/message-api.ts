
import { supabase } from "@/integrations/supabase/client";
import { SupportMessage } from "./types";

// Get messages for a specific support ticket
export async function getTicketMessages(ticketId: string) {
  try {
    const response = await supabase
      .from("support_messages")
      .select(`
        *,
        user:user_id (id, name, role)
      `)
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    
    return { 
      data: response.data as SupportMessage[], 
      error: response.error 
    };
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    return { data: null, error };
  }
}

// Add a new message to a support ticket
export async function addTicketMessage(ticketId: string, userId: string, message: string) {
  try {
    const response = await supabase
      .from("support_messages")
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        message
      })
      .select()
      .single();
    
    return { data: response.data as SupportMessage, error: response.error };
  } catch (error) {
    console.error("Error adding ticket message:", error);
    return { data: null, error };
  }
}

// Delete a support message
export async function deleteTicketMessage(messageId: string) {
  try {
    const response = await supabase
      .from("support_messages")
      .delete()
      .eq("id", messageId);
    
    return { error: response.error };
  } catch (error) {
    console.error("Error deleting ticket message:", error);
    return { error };
  }
}
