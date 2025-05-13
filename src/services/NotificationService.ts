
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "GENERAL" | "SALE" | "SUPPORT";
  read: boolean;
  timestamp: Date;
  data?: any;
}

class NotificationService {
  async getUserNotifications() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(notification => ({
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.is_read || false,
        timestamp: new Date(notification.created_at),
        data: notification.data
      })) || [];

    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  }

  async markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  async markAsUnread(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      return false;
    }
  }

  async markAllAsRead() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  async deleteNotification(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  async deleteAllNotifications() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.user.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      return false;
    }
  }

  async sendNotification(userId: string, title: string, message: string, type: string, data?: any) {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          data
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }
}

export const notificationService = new NotificationService();
