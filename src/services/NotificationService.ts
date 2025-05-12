
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType, DatabaseNotificationType, UserRole } from "@/types";

// Export this type for use in other components
export { NotificationType };

// Helper function to convert database notification type to app notification type
const convertDbTypeToAppType = (dbType: DatabaseNotificationType): NotificationType => {
  return dbType as unknown as NotificationType;
};

// Helper function to convert app notification type to database notification type
const convertAppTypeToDbType = (appType: NotificationType): DatabaseNotificationType => {
  return appType as unknown as DatabaseNotificationType;
};

// Map database notification to app notification
const mapDbNotificationToAppNotification = (dbNotification: any): Notification => {
  return {
    id: dbNotification.id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: convertDbTypeToAppType(dbNotification.type),
    read: dbNotification.is_read,
    created_at: dbNotification.created_at,
    user_id: dbNotification.user_id,
    data: dbNotification.data as Record<string, any> || {},
  };
};

export const NotificationService = {
  async getNotifications(
    userId: string,
    page: number = 1,
    pageSize: number = 10,
    typeFilter: string = 'all',
    statusFilter: string = 'all',
    searchTerm: string = ''
  ) {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Apply type filter if not 'all'
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter as DatabaseNotificationType);
      }

      // Apply read status filter
      if (statusFilter === 'read') {
        query = query.eq('is_read', true);
      } else if (statusFilter === 'unread') {
        query = query.eq('is_read', false);
      }

      // Apply search term to title and message
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }

      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      const notifications = (data || []).map(mapDbNotificationToAppNotification);
      
      return { 
        notifications,
        totalCount: count || 0
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], totalCount: 0 };
    }
  },

  async markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },
  
  async markAsUnread(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      return false;
    }
  },
  
  async deleteNotification(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  },
  
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },
  
  async getUnreadCount(userId: string) {
    try {
      const { data, error, count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) throw error;
      
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Create notification for specific user
  async createNotification(notification: {
    title: string;
    message: string;
    type: NotificationType;
    user_id: string;
    data?: Record<string, any>;
  }) {
    try {
      // Convert NotificationType to DatabaseNotificationType
      const dbType = convertAppTypeToDbType(notification.type);
      
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notification.title,
          message: notification.message,
          type: dbType,
          user_id: notification.user_id,
          is_read: false,
          data: notification.data || {}
        });
        
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  },

  // Send notification to all users with specific role
  async sendNotificationToRole(
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data: Record<string, any> = {}
  ) {
    try {
      // First get all users with the specified role
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role as string);
      
      if (userError) throw userError;
      
      if (!users || users.length === 0) {
        console.log('No users found with role:', role);
        return false;
      }
      
      // Convert NotificationType to DatabaseNotificationType
      const dbType = convertAppTypeToDbType(type);
      
      // Create notifications for all users with that role
      const notifications = users.map(user => ({
        title,
        message,
        type: dbType,
        user_id: user.id,
        is_read: false,
        data: data || {}
      }));
      
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error sending notifications to role:', error);
      return false;
    }
  },
};
