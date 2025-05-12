
import { supabase } from "@/integrations/supabase/client";
import { DatabaseNotification, NotificationType, UserRole } from "@/types";
import { Json } from "@/integrations/supabase/types";

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
const convertToDatabaseType = (type: NotificationType): string => {
  return type;
};

/**
 * Convert from database notification format to application format
 */
const convertFromDatabaseType = (type: string): NotificationType => {
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

/**
 * Create a notification for a specific user
 */
export const createNotification = async (
  title: string, 
  message: string,
  type: NotificationType,
  userId: string,
  data?: Record<string, any>
): Promise<string | null> => {
  try {
    const dbType = convertToDatabaseType(type);
    
    const { data: insertData, error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type: dbType,
        user_id: userId,
        is_read: false,
        data: data as Json || {}
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
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (notificationId: string): Promise<boolean> => {
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
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
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
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId: string): Promise<boolean> => {
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
};

/**
 * Fetch notifications for a user
 */
export const fetchUserNotifications = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }

    // Convert database format to application format
    return data.map((notification: DatabaseNotification) => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: convertFromDatabaseType(notification.type),
      read: notification.is_read,
      created_at: notification.created_at,
      user_id: notification.user_id,
      data: notification.data || {}
    }));
  } catch (error) {
    console.error("Exception fetching notifications:", error);
    return [];
  }
};

/**
 * Send a notification to all users with a specific role
 */
export const sendNotificationToRole = async (
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
      .eq('role', role.toString());

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
      data: data as Json || {},
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
};
