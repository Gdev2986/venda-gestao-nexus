import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";

// Define notification types to match what's available in the database
export type NotificationType = 
  | "PAYMENT" 
  | "BALANCE" 
  | "MACHINE" 
  | "COMMISSION" 
  | "SYSTEM"
  | "PAYMENT_APPROVED" 
  | "PAYMENT_REJECTED"
  | "SALE"
  | "SUPPORT"
  | "GENERAL";

// Define notification interface
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data: Record<string, any>;
  created_at: string;
  is_read: boolean;
}

// Define notification creation interface
export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  data: Record<string, any>;
}

/**
 * Service for handling notification operations
 */
export class NotificationServiceClass {
  /**
   * Send notification to a specific user
   */
  async sendNotificationToUser(
    notification: CreateNotificationDto,
    userId: string
  ): Promise<void> {
    try {
      // We need to cast the type to ensure it works with the database schema
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type as any,
        data: notification.data,
        is_read: false
      });

      if (error) throw error;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }

  /**
   * Send notification to all users with a specific role
   */
  async sendNotificationToRole(
    notification: CreateNotificationDto,
    role: UserRole
  ): Promise<void> {
    try {
      // Get all users with the specified role
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", role as any);

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        console.warn(`No users found with role: ${role}`);
        return;
      }

      // Create notifications for all users - one by one to avoid type issues
      for (const user of users) {
        const { error } = await supabase.from("notifications").insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type as any,
          data: notification.data,
          is_read: false
        });
  
        if (error) {
          console.error("Error inserting notification:", error);
        }
      }
    } catch (error) {
      console.error("Error sending notifications to role:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: false })
        .eq("id", notificationId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * Get notifications for a specific user
   */
  async getUserNotifications(
    userId: string,
    options: {
      page?: number;
      pageSize?: number;
      typeFilter?: string;
      statusFilter?: string;
      searchTerm?: string;
    } = {}
  ): Promise<{ notifications: Notification[]; count: number }> {
    try {
      const {
        page = 1,
        pageSize = 10,
        typeFilter = "all",
        statusFilter = "all",
        searchTerm = "",
      } = options;

      // Start building the query
      let query = supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Apply type filter if specified
      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter as any);
      }

      // Apply status filter if specified
      if (statusFilter === "read") {
        query = query.eq("is_read", true);
      } else if (statusFilter === "unread") {
        query = query.eq("is_read", false);
      }

      // Apply search filter if specified
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`
        );
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Execute the query
      const { data, error, count } = await query;

      if (error) throw error;

      // Transform data to match our interface
      const notifications = (data || []).map((item: any) => ({
        ...item,
        data: item.data || {}
      })) as Notification[];

      return { notifications, count: count || 0 };
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }

  /**
   * Get unread notification count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;

      return count || 0;
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }
}

// Export a singleton instance of the service
export const NotificationService = new NotificationServiceClass();
