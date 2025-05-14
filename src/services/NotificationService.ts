
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { DatabaseNotificationType, UserRole } from "@/types";

export type NotificationType = 
  | "GENERAL" 
  | "SALE" 
  | "PAYMENT" 
  | "MACHINE" 
  | "SUPPORT" 
  | "SYSTEM"
  | "PAYMENT_APPROVED"
  | "PAYMENT_REJECTED"
  | "PAYMENT_REQUEST";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;  // Using "read" consistently throughout the application
  data?: any;
  created_at: string;
  updated_at: string;
}

// Helper function to map our app notification types to database notification types
const mapToDatabaseType = (type: NotificationType): DatabaseNotificationType => {
  // Map our notification types to database types
  switch (type) {
    case "PAYMENT":
    case "PAYMENT_APPROVED":
    case "PAYMENT_REJECTED":
    case "PAYMENT_REQUEST":
      return DatabaseNotificationType.PAYMENT;
    case "MACHINE":
      return DatabaseNotificationType.MACHINE;
    case "SALE":
      return DatabaseNotificationType.COMMISSION;
    case "GENERAL":
    case "SUPPORT":
    case "SYSTEM":
      return DatabaseNotificationType.SYSTEM;
    default:
      return DatabaseNotificationType.SYSTEM; // Default to SYSTEM for any other type
  }
};

// Helper to convert from database to app model
const convertDbToAppModel = (dbNotification: any): Notification => {
  return {
    id: dbNotification.id,
    user_id: dbNotification.user_id,
    title: dbNotification.title,
    message: dbNotification.message,
    type: dbNotification.type as NotificationType,
    read: dbNotification.is_read === true, // Convert is_read to read
    data: dbNotification.data,
    created_at: dbNotification.created_at,
    updated_at: dbNotification.created_at // Using created_at as updated_at if not available
  };
};

export const NotificationService = {
  // Get notifications for the current user
  async getUserNotifications(userId: string, options: { page?: number, limit?: number, unreadOnly?: boolean } = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    
    try {
      let query = supabase
        .from('notifications')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(start, end);
        
      if (unreadOnly) {
        query = query.eq('is_read', false);
      }
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }
      
      // Map database fields to our interface
      const notifications: Notification[] = data?.map(convertDbToAppModel) || [];
      
      return {
        notifications,
        count: count || 0,
        pages: count ? Math.ceil(count / limit) : 1
      };
    } catch (err) {
      console.error("Error in getUserNotifications:", err);
      throw err;
    }
  },
  
  // Mark a notification as read
  async markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) {
        console.error("Error marking notification as read:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error in markAsRead:", err);
      throw err;
    }
  },
  
  // Mark a notification as unread
  async markAsUnread(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);
        
      if (error) {
        console.error("Error marking notification as unread:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error in markAsUnread:", err);
      throw err;
    }
  },
  
  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId);
        
      if (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error in markAllAsRead:", err);
      throw err;
    }
  },
  
  // Delete a notification
  async deleteNotification(id: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    } catch (err) {
      console.error("Error in deleteNotification:", err);
      throw err;
    }
  },
  
  // Send a notification to a specific user
  async sendNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read'>) {
    try {
      // Map our notification type to database notification type
      const dbType = mapToDatabaseType(notification.type);
      
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          title: notification.title,
          message: notification.message,
          type: dbType,
          data: notification.data || {},
          is_read: false
        })
        .select();
        
      if (error) {
        console.error("Error sending notification:", error);
        throw error;
      }
      
      return data?.[0];
    } catch (err) {
      console.error("Error in sendNotification:", err);
      throw err;
    }
  },
  
  // Send a notification to all users with a specific role
  async sendNotificationToRole(
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read' | 'user_id'>, 
    role: UserRole
  ) {
    try {
      // Map our notification type to database notification type
      const dbType = mapToDatabaseType(notification.type);
      
      // First get all users with this role
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', role);
        
      if (usersError) {
        console.error("Error fetching users by role:", usersError);
        throw usersError;
      }
      
      if (!users || users.length === 0) {
        console.warn(`No users found with role: ${role}`);
        return [];
      }
      
      // Create a notification for each user
      const notificationsToInsert = users.map(user => ({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        type: dbType,
        data: notification.data || {},
        is_read: false
      }));
      
      // Insert notifications in batches to avoid potential size limits
      const batchSize = 50;
      let results = [];
      
      for (let i = 0; i < notificationsToInsert.length; i += batchSize) {
        const batch = notificationsToInsert.slice(i, i + batchSize);
        const { data, error } = await supabase
          .from('notifications')
          .insert(batch)
          .select();
          
        if (error) {
          console.error(`Error sending notifications batch ${i/batchSize + 1}:`, error);
          throw error;
        }
        
        if (data) {
          results.push(...data);
        }
      }
      
      return results;
    } catch (err) {
      console.error("Error in sendNotificationToRole:", err);
      throw err;
    }
  },
  
  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, onNewNotification: (notification: Notification) => void) {
    try {
      const channel = supabase
        .channel(`user-notifications-${userId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, (payload) => {
          // Transform the database fields to match our Notification interface
          const dbNotification = payload.new as any;
          const newNotification = convertDbToAppModel(dbNotification);
          
          // Show a toast notification
          toast(newNotification.title, {
            description: newNotification.message,
          });
          
          // Call the callback with the new notification
          onNewNotification(newNotification);
        })
        .subscribe((status) => {
          if (status !== 'SUBSCRIBED') {
            console.warn(`Notification subscription status: ${status}`);
          }
        });
        
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (err) {
      console.error("Error in subscribeToNotifications:", err);
      // Return a no-op cleanup function
      return () => {};
    }
  }
};
