
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DatabaseNotificationType, UserRole, Notification } from "@/types";

class NotificationService {
  // Get all notifications for a user
  async getNotifications({ 
    userId, 
    page = 1, 
    pageSize = 10, 
    typeFilter = 'all',
    statusFilter = 'all'
  }: { 
    userId: string;
    page?: number;
    pageSize?: number;
    typeFilter?: string;
    statusFilter?: string;
  }) {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply type filter
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      // Apply read status filter
      if (statusFilter === 'read') {
        query = query.eq('read', true);
      } else if (statusFilter === 'unread') {
        query = query.eq('read', false);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return { 
        notifications: data as Notification[], 
        count: count || 0 
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], count: 0 };
    }
  }

  // Mark a notification as read
  async markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  }

  // Mark a notification as unread
  async markAsUnread(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: false })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      return { success: false };
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false };
    }
  }

  // Delete a notification
  async deleteNotification(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false };
    }
  }

  // Get unread notification count for a user
  async getUnreadCount(userId: string) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) {
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
      return 0;
    }
  }

  // Send a notification to specific users or roles
  async sendNotification({
    title,
    message,
    type,
    recipients,
    data = {}
  }: {
    title: string;
    message: string;
    type: DatabaseNotificationType;
    recipients: {
      role?: UserRole;
      userId?: string;
    };
    data?: Record<string, any>;
  }) {
    try {
      // Check if sending to a role or specific user
      if (recipients.role) {
        return this.sendNotificationToRole(title, message, type, recipients.role, data);
      } else if (recipients.userId) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: recipients.userId,
            title,
            message,
            type,
            data,
            read: false,
            created_at: new Date().toISOString()
          });

        if (error) {
          throw error;
        }

        return { success: true };
      }

      return { success: false, error: 'No valid recipient specified' };
    } catch (error) {
      console.error('Error sending notification:', error);
      return { success: false, error };
    }
  }

  // Send a notification to all users with a specific role
  async sendNotificationToRole(
    title: string,
    message: string,
    type: DatabaseNotificationType,
    role: UserRole,
    data: Record<string, any> = {}
  ) {
    try {
      // First, get all users with the specified role
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role);

      if (usersError) {
        throw usersError;
      }

      if (!users || users.length === 0) {
        return { success: false, error: `No users found with role ${role}` };
      }

      // Create notification for each user
      const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        type,
        data,
        read: false,
        created_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error sending notification to role:', error);
      return { success: false, error };
    }
  }
}

export const notificationService = new NotificationService();
