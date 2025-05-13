
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
export type NotificationType = "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationPreference {
  id: string;
  user_id: string;
  payment_status_updates: boolean;
  payments_received: boolean;
  admin_messages: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationFilters {
  isRead?: boolean;
  type?: NotificationType;
  dateRange?: { from: Date; to: Date };
}

class NotificationService {
  // Get all notifications for the current user
  async getNotifications(userId: string, filters?: NotificationFilters): Promise<Notification[]> {
    try {
      let query = supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      // Apply filters if provided
      if (filters) {
        if (filters.isRead !== undefined) {
          query = query.eq("is_read", filters.isRead);
        }

        if (filters.type) {
          query = query.eq("type", filters.type);
        }

        if (filters.dateRange) {
          query = query
            .gte("created_at", filters.dateRange.from.toISOString())
            .lte("created_at", filters.dateRange.to.toISOString());
        }
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data as Notification[];
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Count unread notifications for the current user
  async countUnreadNotifications(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error("Error counting unread notifications:", error);
      return 0;
    }
  }

  // Mark a notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId)
        .eq("is_read", false);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Get notification preferences for a user
  async getNotificationPreferences(userId: string): Promise<NotificationPreference | null> {
    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw error;
      }

      return data as NotificationPreference;
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      return null;
    }
  }

  // Send a notification to a user
  async sendNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: any
  ): Promise<void> {
    try {
      const { error } = await supabase.from("notifications").insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false,
        data,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();

// Custom hooks
export const useUnreadNotificationsCount = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["unreadNotificationsCount", userId],
    queryFn: () => (userId ? notificationService.countUnreadNotifications(userId) : 0),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useNotifications = (userId: string | undefined, filters?: NotificationFilters) => {
  return useQuery({
    queryKey: ["notifications", userId, filters],
    queryFn: () => (userId ? notificationService.getNotifications(userId, filters) : []),
    enabled: !!userId,
  });
};

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });
    },
  });
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => notificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationsCount"] });
    },
  });
};
