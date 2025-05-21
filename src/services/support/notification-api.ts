
import { supabase } from "@/integrations/supabase/client";

// Send notifications to support agents about new tickets
export async function notifySupportAgents(ticketId: string, title: string, message: string) {
  try {
    // Get all users with SUPPORT or ADMIN role
    const { data: supportUsers } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["SUPPORT", "ADMIN"]);
    
    if (!supportUsers || supportUsers.length === 0) {
      return { success: false, error: "No support agents found" };
    }
    
    // Create notifications for each support agent
    const notifications = supportUsers.map(user => ({
      user_id: user.id,
      title,
      message,
      type: "SUPPORT_TICKET",
      data: { ticket_id: ticketId }
    }));
    
    const { error } = await supabase
      .from("notifications")
      .insert(notifications);
    
    return { success: !error, error };
  } catch (error) {
    console.error("Error notifying support agents:", error);
    return { success: false, error };
  }
}

// Mark ticket notifications as read
export async function markTicketNotificationsAsRead(userId: string, ticketId: string) {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("data->ticket_id", ticketId);
    
    return { success: !error, error };
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return { success: false, error };
  }
}
