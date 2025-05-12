
import { supabase } from "../integrations/supabase/client";
import { 
  Notification, 
  DatabaseNotification,
  NotificationType, 
  DatabaseNotificationType, 
  UserRole 
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { Json } from "@/integrations/supabase/types";

export class NotificationService {
  
  // Converter para transformar entre o formato do banco de dados e o formato da aplicação
  private static convertFromDatabase(dbNotification: DatabaseNotification): Notification {
    return {
      id: dbNotification.id,
      title: dbNotification.title,
      message: dbNotification.message,
      type: dbNotification.type as NotificationType,
      read: dbNotification.is_read,
      created_at: dbNotification.created_at,
      user_id: dbNotification.user_id,
      data: dbNotification.data as Record<string, any>,
    };
  }

  private static convertToDatabase(notification: Partial<Notification>): Partial<DatabaseNotification> {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as DatabaseNotificationType,
      is_read: notification.read,
      created_at: notification.created_at,
      user_id: notification.user_id,
      data: notification.data as Json,
    };
  }

  // Get notifications for a user
  static async getNotifications(
    userId: string, 
    page = 1, 
    pageSize = 10,
    typeFilter = 'all',
    statusFilter = 'all',
    searchTerm = ''
  ): Promise<{ notifications: Notification[]; totalCount: number }> {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      // Apply type filter if not 'all'
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }
      
      // Apply status filter
      if (statusFilter === 'read') {
        query = query.eq('is_read', true);
      } else if (statusFilter === 'unread') {
        query = query.eq('is_read', false);
      }
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      // Calculate pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Execute query with range
      const { data, error, count } = await query.range(from, to);
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      // Convert database notifications to application notifications
      const notifications = (data || []).map(notif => 
        this.convertFromDatabase(notif as DatabaseNotification)
      );
      
      return {
        notifications,
        totalCount: count || 0
      };
    } catch (error) {
      console.error("Error in getNotifications:", error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
      
      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in markAsRead:", error);
      throw error;
    }
  }

  // Mark notification as unread
  static async markAsUnread(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', notificationId);
      
      if (error) {
        console.error("Error marking notification as unread:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in markAsUnread:", error);
      throw error;
    }
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in deleteNotification:", error);
      throw error;
    }
  }

  // Get count of unread notifications
  static async getUnreadCount(userId: string): Promise<number> {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error("Error counting unread notifications:", error);
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      console.error("Error in getUnreadCount:", error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
      
      if (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in markAllAsRead:", error);
      throw error;
    }
  }

  // Create a new notification
  static async createNotification({
    title,
    message,
    type,
    role,
    data = {}
  }: {
    title: string;
    message: string;
    type: DatabaseNotificationType;
    role: UserRole;
    data?: Record<string, any>;
  }): Promise<string> {
    try {
      // Find users with the specified role
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role as string);
      
      if (usersError) {
        console.error("Error finding users with specified role:", usersError);
        throw usersError;
      }
      
      if (!users || users.length === 0) {
        throw new Error(`No users found with role ${role}`);
      }
      
      // Create notifications for each user with the role
      const notificationPromises = users.map(async (user) => {
        const notificationId = uuidv4();
        
        const { error } = await supabase
          .from('notifications')
          .insert({
            id: notificationId,
            user_id: user.id,
            title,
            message,
            type,
            is_read: false,
            data
          });
        
        if (error) {
          console.error(`Error creating notification for user ${user.id}:`, error);
          throw error;
        }
        
        return notificationId;
      });
      
      const results = await Promise.all(notificationPromises);
      return results[0]; // Return the first notification ID
      
    } catch (error) {
      console.error("Error in createNotification:", error);
      throw error;
    }
  }
}
