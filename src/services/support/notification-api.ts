
import { supabase } from "@/lib/supabase";
import { SupportTicket } from "./types";

// Notify relevant staff about a new support ticket
export const notifyNewTicket = async (ticket: SupportTicket): Promise<void> => {
  try {
    // Get all admin and logistics users who should be notified
    const { data: staffUsers, error: staffError } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["ADMIN", "LOGISTICS"]);

    if (staffError) {
      console.error("Error fetching staff users:", staffError);
      throw staffError;
    }

    // Create notifications for each staff member
    const notifications = staffUsers.map(user => ({
      user_id: user.id,
      title: "Nova Solicitação de Suporte",
      message: `Nova solicitação: ${ticket.title}`,
      type: "SUPPORT" as const,
      data: { ticket_id: ticket.id }
    }));

    // Insert all notifications
    if (notifications.length > 0) {
      const { error: notifyError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notifyError) {
        console.error("Error creating notifications:", notifyError);
        throw notifyError;
      }
    }
  } catch (error) {
    console.error("Failed to send notifications:", error);
    // Don't throw here, we want the ticket creation to succeed even if notifications fail
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};
