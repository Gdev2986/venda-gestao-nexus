
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

// Define notification types to ensure consistency
export type NotificationType =
  | "PAYMENT_REQUEST"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "GENERAL"
  | "SYSTEM"
  | "CLIENT_CREATED"
  | "PARTNER_CREATED"
  | "PAYMENT"
  | "BALANCE"
  | "MACHINE"
  | "COMMISSION";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read?: boolean;
  created_at: string;
  updated_at?: string;
}

class NotificationService {
  /**
   * Send a notification to a specific user
   * @param notification The notification data
   * @param userId The user ID to send notification to
   */
  async sendNotificationToUser(notification: {
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, any>;
  }, userId: string) {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
      });

      if (error) throw error;

      console.log(`Notification sent to user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  /**
   * Send a notification to all users with a specific role
   * @param notification The notification data
   * @param role The user role to target
   */
  async sendNotificationToRole(notification: {
    title: string;
    message: string;
    type: NotificationType;
    data?: Record<string, any>;
  }, role: UserRole) {
    try {
      // First, get all users with the specified role
      const { data: users, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", role); // Use the role value directly

      if (error) throw error;

      if (!users || users.length === 0) {
        console.log(`No users found with role ${role}`);
        return false;
      }

      // Send notification to each user
      const promises = users.map((user) =>
        this.sendNotificationToUser(notification, user.id)
      );

      await Promise.all(promises);
      console.log(`Notifications sent to ${users.length} users with role ${role}`);
      return true;
    } catch (error) {
      console.error("Error sending notifications to role:", error);
      return false;
    }
  }

  /**
   * Send a notification to multiple users
   * @param notification The notification data
   * @param userIds Array of user IDs
   */
  async sendNotificationToMultipleUsers(
    notification: {
      title: string;
      message: string;
      type: NotificationType;
      data?: Record<string, any>;
    },
    userIds: string[]
  ) {
    try {
      if (!userIds.length) return false;

      const notifications = userIds.map((userId) => ({
        user_id: userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
      }));

      const { error } = await supabase.from("notifications").insert(notifications);

      if (error) throw error;

      console.log(`Notifications sent to ${userIds.length} users`);
      return true;
    } catch (error) {
      console.error("Error sending notifications to multiple users:", error);
      return false;
    }
  }

  /**
   * Get notifications for a specific user
   * @param userId The user ID
   * @param limit Optional limit
   * @param offset Optional offset for pagination
   */
  async getUserNotifications(
    userId: string,
    options: { page?: number; limit?: number } = {}
  ) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;
    
    try {
      const { data, error, count } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const totalPages = count ? Math.ceil(count / limit) : 0;

      return {
        notifications: (data || []) as Notification[],
        count: count || 0,
        pages: totalPages,
      };
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      return {
        notifications: [] as Notification[],
        count: 0,
        pages: 0,
      };
    }
  }

  /**
   * Mark a notification as read
   * @param notificationId ID of the notification to mark as read
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return false;
    }
  }

  /**
   * Mark a notification as unread
   * @param notificationId ID of the notification to mark as unread
   */
  async markAsUnread(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: false })
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      return false;
    }
  }

  /**
   * Mark all notifications for a user as read
   * @param userId The user ID
   */
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      console.log(`Marked all notifications as read for user ${userId}`);
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }

  /**
   * Delete a notification
   * @param notificationId ID of the notification to delete
   */
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting notification:", error);
      return false;
    }
  }

  /**
   * Send a general notification
   * @param notification The notification data
   */
  async sendNotification(notification: {
    title: string;
    message: string;
    type: NotificationType;
    user_id: string;
    data?: Record<string, any>;
  }) {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {},
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error sending notification:", error);
      return false;
    }
  }

  /**
   * Subscribe to real-time notifications for a specific user
   * @param userId The user ID
   * @param onNotification Callback function when a new notification is received
   */
  subscribeToNotifications(
    userId: string,
    onNotification: (notification: Notification) => void
  ) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onNotification(payload.new as Notification);
        }
      )
      .subscribe();
  }
}

// Create and export a singleton instance
export const notificationService = new NotificationService();
