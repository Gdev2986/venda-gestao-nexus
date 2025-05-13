import { supabase } from "@/integrations/supabase/client";

export class NotificationService {
  /**
   * Fetches notifications for a specific user
   * @param userId - The ID of the user
   * @param limit - The maximum number of notifications to return (optional, default is 10)
   * @param offset - The starting point for fetching notifications (optional, default is 0)
   * @returns A promise that resolves to an array of notifications or rejects with an error
   */
  async getNotifications(userId: string, limit: number = 10, offset: number = 0) {
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

      return data || [];
    } catch (error: any) {
      console.error('Error in getNotifications:', error);
      return [];
    }
  }

  /**
   * Marks a notification as read
   * @param notificationId - The ID of the notification to mark as read
   * @returns A promise that resolves when the notification is successfully marked as read or rejects with an error
   */
  async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        throw new Error(`Error marking notification as read: ${error.message}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in markAsRead:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deletes a notification
   * @param notificationId - The ID of the notification to delete
   * @returns A promise that resolves when the notification is successfully deleted or rejects with an error
   */
  async deleteNotification(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        throw new Error(`Error deleting notification: ${error.message}`);
      }

      return { success: true };
    } catch (error: any) {
      console.error('Error in deleteNotification:', error);
      return { success: false, error: error.message };
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
  }) {
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

      return { success: true };
    } catch (error: any) {
      console.error('Error in createNotification:', error);
      return { success: false, error: error.message };
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
  }) {
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

      return { success: true };
    } catch (error: any) {
      console.error('Error in createBulkNotifications:', error);
      return { success: false, error: error.message };
    }
  }
}
