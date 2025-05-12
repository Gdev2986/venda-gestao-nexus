
import { supabase } from "@/integrations/supabase/client";
import { DatabaseNotification, NotificationType, UserRole, DatabaseNotificationType } from "@/types";

export interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
  user_id: string;
  data?: Record<string, any>;
  role?: UserRole;
}

/**
 * Convert from application notification type to database notification type
 */
const convertToDatabaseType = (type: NotificationType): DatabaseNotificationType => {
  return type as DatabaseNotificationType;
};

/**
 * Convert from database notification format to application format
 */
const convertFromDatabaseType = (type: DatabaseNotificationType): NotificationType => {
  switch (type) {
    case "PAYMENT": return NotificationType.PAYMENT;
    case "BALANCE": return NotificationType.BALANCE;
    case "MACHINE": return NotificationType.MACHINE;
    case "COMMISSION": return NotificationType.COMMISSION;
    case "SYSTEM": return NotificationType.SYSTEM;
    case "SALE": return NotificationType.SALE;
    case "SUPPORT": return NotificationType.SUPPORT;
    default:
      console.warn(`Unknown notification type: ${type}, defaulting to SYSTEM`);
      return NotificationType.SYSTEM;
  }
};

// Create NotificationService object to export all functions together
export const NotificationService = {
  /**
   * Create a notification for a specific user
   */
  createNotification: async (payload: NotificationPayload): Promise<string | null> => {
    try {
      const { title, message, type, user_id, data } = payload;
      const dbType = convertToDatabaseType(type);
      
      const { data: insertData, error } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type: dbType,
          user_id,
          is_read: false,
          data: data || {}
        })
        .select('id')
        .single();

      if (error) {
        console.error("Error creating notification:", error);
        return null;
      }

      return insertData?.id || null;
    } catch (error) {
      console.error("Exception creating notification:", error);
      return null;
    }
  },

  /**
   * Mark a notification as read
   */
  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error("Error marking notification as read:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception marking notification as read:", error);
      return false;
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead: async (userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception marking all notifications as read:", error);
      return false;
    }
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error("Error deleting notification:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception deleting notification:", error);
      return false;
    }
  },

  /**
   * Fetch notifications for a user
   */
  getNotifications: async (userId: string, page = 1, pageSize = 10, typeFilter = "all", statusFilter = "all", searchTerm = "") => {
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);
      
      // Apply type filter
      if (typeFilter !== "all") {
        query = query.eq('type', typeFilter as DatabaseNotificationType);
      }
      
      // Apply status filter
      if (statusFilter === "read") {
        query = query.eq('is_read', true);
      } else if (statusFilter === "unread") {
        query = query.eq('is_read', false);
      }
      
      // Apply search filter
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,message.ilike.%${searchTerm}%`);
      }
      
      // Apply pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching notifications:", error);
        return { notifications: [], totalCount: 0, totalPages: 0 };
      }

      // Convert database format to application format
      const notifications = (data || []).map((dbNotification: any) => ({
        id: dbNotification.id,
        title: dbNotification.title,
        message: dbNotification.message,
        type: convertFromDatabaseType(dbNotification.type as DatabaseNotificationType),
        read: dbNotification.is_read,
        created_at: dbNotification.created_at,
        user_id: dbNotification.user_id,
        data: dbNotification.data || {}
      }));

      const totalCount = count || 0;
      const totalPages = Math.ceil(totalCount / pageSize);
      
      return { notifications, totalCount, totalPages };
    } catch (error) {
      console.error("Exception fetching notifications:", error);
      return { notifications: [], totalCount: 0, totalPages: 0 };
    }
  },
  
  /**
   * Get the count of unread notifications for a user
   */
  getUnreadCount: async (userId: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error("Error counting unread notifications:", error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error("Exception counting unread notifications:", error);
      return 0;
    }
  },

  /**
   * Send a notification to all users with a specific role
   */
  sendNotificationToRole: async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data?: Record<string, any>
  ): Promise<boolean> => {
    try {
      // First, fetch all users with the specified role
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role);

      if (usersError) {
        console.error("Error fetching users by role:", usersError);
        return false;
      }

      if (!users || users.length === 0) {
        console.log(`No users found with role: ${role}`);
        return false;
      }

      // Create notifications for each user
      const notificationsToInsert = users.map(user => ({
        title,
        message,
        type: convertToDatabaseType(type),
        user_id: user.id,
        is_read: false,
        data: data || {},
      }));

      const { error: insertError } = await supabase
        .from('notifications')
        .insert(notificationsToInsert);

      if (insertError) {
        console.error("Error creating bulk notifications:", insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Exception sending notifications to role:", error);
      return false;
    }
  }
};
