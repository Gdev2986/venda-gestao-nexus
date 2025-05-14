
import { supabase } from '@/integrations/supabase/client';
import { NotificationType, UserRole, Notification, DatabaseNotification } from '@/types';

// Helper function to safely cast types
const safeCastNotificationType = (type: NotificationType): string => {
  return type.toString();
};

// Helper function to safely cast user roles
const safeCastUserRole = (role: UserRole): string => {
  return role.toString();
};

// Singleton pattern for notification service
class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Send notification to a specific user
  public async sendToUser(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type: safeCastNotificationType(type),
        is_read: false,
        data: data || {}
      });

      if (error) {
        console.error('Error sending notification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // Create a notification
  public async createNotification(
    title: string,
    message: string,
    type: NotificationType,
    userId: string = '',
    data: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type: safeCastNotificationType(type),
        is_read: false,
        data
      });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  // Send notification to all users
  public async sendToAll(
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get all users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id');

      if (usersError || !users) {
        console.error('Error fetching users:', usersError);
        return false;
      }

      // Create notification objects for each user
      const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        type: safeCastNotificationType(type),
        is_read: false,
        data: data || {}
      }));

      // Insert notifications one by one to avoid type issues
      for (const notification of notifications) {
        const { error } = await supabase
          .from('notifications')
          .insert(notification);
        
        if (error) {
          console.error('Error sending notification:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error sending notifications to all users:', error);
      return false;
    }
  }

  // Send notification to users with specific role
  public async sendToRole(
    role: UserRole,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ): Promise<boolean> {
    try {
      // Get all users with specific role
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', safeCastUserRole(role));

      if (usersError || !users) {
        console.error(`Error fetching users with role ${role}:`, usersError);
        return false;
      }

      // If no users found with this role
      if (users.length === 0) {
        console.warn(`No users found with role ${role}`);
        return true;
      }

      // Insert notifications one by one to avoid type issues
      for (const user of users) {
        const { error } = await supabase
          .from('notifications')
          .insert({
            user_id: user.id,
            title,
            message,
            type: safeCastNotificationType(type),
            is_read: false,
            data: data || {}
          });
        
        if (error) {
          console.error('Error sending notification:', error);
        }
      }

      return true;
    } catch (error) {
      console.error(`Error sending notifications to users with role ${role}:`, error);
      return false;
    }
  }

  // Mark notification as read
  public async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  // Mark notification as unread
  public async markAsUnread(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as unread:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      return false;
    }
  }

  // Delete notification
  public async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  // Mark all notifications as read for a user
  public async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  }

  // Get notifications for a user with pagination
  public async getForUser(
    userId: string,
    page = 1,
    limit = 10,
    filters: {
      typeFilter?: string,
      statusFilter?: string,
      searchTerm?: string,
      unreadOnly?: boolean
    } = {}
  ): Promise<{
    notifications: Notification[];
    totalCount: number;
    totalPages: number;
  }> {
    try {
      const { typeFilter, statusFilter, searchTerm, unreadOnly } = filters;
      
      // Count total notifications
      let countQuery = supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);
        
      if (unreadOnly || statusFilter === 'unread') {
        countQuery = countQuery.eq('is_read', false);
      } else if (statusFilter === 'read') {
        countQuery = countQuery.eq('is_read', true);
      }

      if (typeFilter && typeFilter !== 'all') {
        countQuery = countQuery.eq('type', typeFilter);
      }

      if (searchTerm) {
        countQuery = countQuery.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error counting notifications:', countError);
        return { notifications: [], totalCount: 0, totalPages: 0 };
      }
      
      // Calculate pagination values
      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / limit);
      const offset = (page - 1) * limit;
      
      // Get paginated notifications
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
        
      if (unreadOnly || statusFilter === 'unread') {
        query = query.eq('is_read', false);
      } else if (statusFilter === 'read') {
        query = query.eq('is_read', true);
      }

      if (typeFilter && typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], totalCount, totalPages };
      }
      
      // Map database objects to front-end model
      const notifications: Notification[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        is_read: item.is_read,
        created_at: item.created_at,
        user_id: item.user_id,
        data: item.data
      }));
      
      return {
        notifications,
        totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { notifications: [], totalCount: 0, totalPages: 0 };
    }
  }
  
  // Get unread notification count for a user
  public async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error counting unread notifications:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error counting unread notifications:', error);
      return 0;
    }
  }
  
  // Delete a notification
  public async delete(notificationId: string): Promise<boolean> {
    return this.deleteNotification(notificationId);
  }
}

// Export singleton instance
const notificationService = NotificationService.getInstance();
export default notificationService;
