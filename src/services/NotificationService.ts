import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { hasRole } from "@/utils/auth-utils";

// Define the notification types that match the database enum
export type NotificationType = 
  | "PAYMENT" 
  | "BALANCE" 
  | "MACHINE" 
  | "COMMISSION" 
  | "SYSTEM"
  | "PAYMENT_REQUEST"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED";

export interface Notification {
  id?: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  is_read?: boolean;
  created_at?: string;
}

class NotificationService {
  // Send a notification to a specific user
  async sendToUser(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data: Record<string, any> = {}
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        title,
        message,
        type: type as any, // Type casting to handle enum mismatch
        data,
      });

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error };
    }
  }

  // Send a notification to all users with a specific role
  async sendToRole(
    role: string,
    title: string,
    message: string,
    type: NotificationType,
    data: Record<string, any> = {}
  ): Promise<{ success: boolean; error: any }> {
    try {
      // Get all users with the specified role
      const { data: users, error: fetchError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", role);

      if (fetchError) throw fetchError;

      if (!users || users.length === 0) {
        return {
          success: false,
          error: `No users found with role: ${role}`,
        };
      }

      // Prepare notifications for all users
      const notifications = users.map((user) => ({
        user_id: user.id,
        type: type as any, // Type casting to handle enum mismatch
        title,
        message,
        data,
      }));

      // Insert all notifications
      const { error } = await supabase.from("notifications").insert(
        notifications as any // Type casting to handle array type mismatch
      );

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error sending notifications to role:", error);
      return { success: false, error };
    }
  }

  // Mark a notification as read
  async markAsRead(
    notificationId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return { success: false, error };
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(
    userId: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return { success: true, error: null };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return { success: false, error };
    }
  }

  // Get all notifications for a user
  async getForUser(
    userId: string,
    limit = 50
  ): Promise<{
    data: Notification[] | null;
    error: any;
  }> {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return { data: null, error };
    }
  }

  // Get unread notifications count for a user
  async getUnreadCount(
    userId: string
  ): Promise<{ count: number; error: any }> {
    try {
      const { data, error, count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) throw error;
      return { count: count || 0, error: null };
    } catch (error) {
      console.error("Error counting unread notifications:", error);
      return { count: 0, error };
    }
  }

  // Send a system notification to appropriate roles based on the notification type
  async sendSystemNotification(
    title: string,
    message: string,
    type: NotificationType,
    data: Record<string, any> = {},
    specificUserId?: string
  ): Promise<{ success: boolean; error: any }> {
    try {
      // If a specific user ID is provided, send only to that user
      if (specificUserId) {
        return this.sendToUser(specificUserId, title, message, type, data);
      }

      // Otherwise, determine which roles should receive this notification based on type
      const targetRoles: string[] = this.getRolesForNotificationType(type);

      // Send to all specified roles
      const sendPromises = targetRoles.map((role) =>
        this.sendToRole(role, title, message, type, data)
      );

      await Promise.all(sendPromises);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error sending system notification:", error);
      return { success: false, error };
    }
  }

  // Determine which roles should receive notifications of a specific type
  private getRolesForNotificationType(type: NotificationType): string[] {
    switch (type) {
      case "PAYMENT":
      case "PAYMENT_REQUEST":
        return ["ADMIN", "FINANCIAL"];
      case "MACHINE":
        return ["ADMIN", "LOGISTICS"];
      case "COMMISSION":
        return ["ADMIN", "FINANCIAL", "PARTNER"];
      case "SYSTEM":
        return ["ADMIN"];
      default:
        return ["ADMIN"];
    }
  }
}

// Create instance and export
export const notificationService = new NotificationService();
// Export the class for use in tests
export { NotificationService };
