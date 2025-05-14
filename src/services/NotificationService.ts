
import { supabase } from '@/integrations/supabase/client';
import { NotificationType, UserRole } from '@/types';

// Database notification types should match the ones in the database
type DatabaseNotificationType = "PAYMENT" | "BALANCE" | "MACHINE" | "COMMISSION" | "SYSTEM" | "SALE" | "SUPPORT";
type DatabaseUserRole = "ADMIN" | "FINANCIAL" | "PARTNER" | "LOGISTICS" | "CLIENT";

// Helper function to safely cast types
const safeCastNotificationType = (type: NotificationType): DatabaseNotificationType => {
  // Map NotificationType enum to database string literals
  const mapping: Record<NotificationType, DatabaseNotificationType> = {
    [NotificationType.PAYMENT]: "PAYMENT",
    [NotificationType.BALANCE]: "BALANCE",
    [NotificationType.MACHINE]: "MACHINE", 
    [NotificationType.COMMISSION]: "COMMISSION",
    [NotificationType.SYSTEM]: "SYSTEM",
    [NotificationType.SALE]: "SALE",
    [NotificationType.SUPPORT]: "SYSTEM" // Map SUPPORT to SYSTEM as fallback
  };
  
  return mapping[type] || "SYSTEM";
};

// Helper function to safely cast user roles
const safeCastUserRole = (role: UserRole): DatabaseUserRole => {
  // Map UserRole enum to database string literals
  const mapping: Record<UserRole, DatabaseUserRole> = {
    [UserRole.ADMIN]: "ADMIN",
    [UserRole.FINANCIAL]: "FINANCIAL",
    [UserRole.PARTNER]: "PARTNER",
    [UserRole.LOGISTICS]: "LOGISTICS",
    [UserRole.CLIENT]: "CLIENT",
    [UserRole.MANAGER]: "ADMIN", // Map MANAGER to ADMIN
    [UserRole.FINANCE]: "FINANCIAL", // Map FINANCE to FINANCIAL
    [UserRole.SUPPORT]: "ADMIN", // Map SUPPORT to ADMIN
    [UserRole.USER]: "CLIENT" // Map USER to CLIENT
  };
  
  return mapping[role] || "CLIENT";
};

// Notification interface to match the database structure
interface Notification {
  id: string;
  user_id: string; 
  type: DatabaseNotificationType;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  title: string;
  message: string;
}

interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  totalPages: number;
}

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

      // Insert all notifications
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error sending notifications to all users:', error);
        return false;
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

      // Create notification objects for each user
      const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        type: safeCastNotificationType(type),
        is_read: false,
        data: data || {}
      }));

      // Insert all notifications
      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error(`Error sending notifications to users with role ${role}:`, error);
        return false;
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
    unreadOnly = false
  ): Promise<NotificationResponse> {
    try {
      // Count total notifications
      let countQuery = supabase
        .from('notifications')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);
        
      if (unreadOnly) {
        countQuery = countQuery.eq('is_read', false);
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
        
      if (unreadOnly) {
        query = query.eq('is_read', false);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return { notifications: [], totalCount, totalPages };
      }
      
      return {
        notifications: data || [],
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
}

// Export singleton instance
export default NotificationService.getInstance();
