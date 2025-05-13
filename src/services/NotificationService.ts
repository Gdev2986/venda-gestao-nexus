
import { supabase } from "@/integrations/supabase/client";

// Define notification type
export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  is_read: boolean;
  created_at: Date;
  timestamp: Date; // Alias for created_at for backwards compatibility
  read: boolean; // Alias for is_read for backwards compatibility
};

export class NotificationService {
  /**
   * Fetches notifications for a specific user
   * @param userId - The ID of the user
   * @param limit - The maximum number of notifications to return (optional, default is 10)
   * @param offset - The starting point for fetching notifications (optional, default is 0)
   * @returns A promise that resolves to an array of notifications or rejects with an error
   */
  async getNotifications(userId: string, limit: number = 10, offset: number = 0): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        throw new Error(`Error fetching notifications: ${error.message}`);
      }

      return (data || []).map(notification => ({
        ...notification,
        timestamp: new Date(notification.created_at),
        read: notification.is_read
      })) as Notification[];
    } catch (error: any) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  /**
   * Fetches all notifications for the current user
   */
  async getUserNotifications(): Promise<Notification[]> {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];
    
    return this.getNotifications(userData.user.id);
  }

  /**
   * Marks a notification as read
   * @param notificationId - The ID of the notification to mark as read
   * @returns A promise that resolves when the notification is successfully marked as read or rejects with an error
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        throw new Error(`Error marking notification as read: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in markAsRead:', error);
      return false;
    }
  }

  /**
   * Marks a notification as unread
   */
  async markAsUnread(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', notificationId);

      if (error) {
        throw new Error(`Error marking notification as unread: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in markAsUnread:', error);
      return false;
    }
  }

  /**
   * Marks all notifications for a user as read
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userData.user.id)
        .eq('is_read', false);

      if (error) {
        throw new Error(`Error marking all notifications as read: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in markAllAsRead:', error);
      return false;
    }
  }

  /**
   * Deletes a notification
   * @param notificationId - The ID of the notification to delete
   * @returns A promise that resolves when the notification is successfully deleted or rejects with an error
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw new Error(`Error deleting notification: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in deleteNotification:', error);
      return false;
    }
  }
  
  /**
   * Deletes all notifications for a user
   */
  async deleteAllNotifications(): Promise<boolean> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return false;

      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userData.user.id);

      if (error) {
        throw new Error(`Error deleting all notifications: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in deleteAllNotifications:', error);
      return false;
    }
  }
  
  /**
   * Creates a new notification
   */
  async createNotification(notification: {
    user_id: string;
    title: string;
    message: string;
    type: string;
    data?: any;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          is_read: false
        });

      if (error) {
        throw new Error(`Error creating notification: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in createNotification:', error);
      return false;
    }
  }

  /**
   * Creates notifications for multiple users
   */
  async createBulkNotifications(notifications: {
    user_ids: string[];
    title: string;
    message: string;
    type: string;
    data?: any;
  }): Promise<boolean> {
    try {
      const notificationsToInsert = notifications.user_ids.map(userId => ({
        user_id: userId,
        title: notifications.title,
        message: notifications.message,
        type: notifications.type,
        data: notifications.data || {},
        is_read: false
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notificationsToInsert);

      if (error) {
        throw new Error(`Error creating bulk notifications: ${error.message}`);
      }

      return true;
    } catch (error: any) {
      console.error('Error in createBulkNotifications:', error);
      return false;
    }
  }
}

// Export a singleton instance of the service
export const notificationService = new NotificationService();
