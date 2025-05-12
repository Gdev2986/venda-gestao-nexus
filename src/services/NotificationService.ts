
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";

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
  read: boolean;
  data?: any;
  created_at: string;
  updated_at: string;
}

export const NotificationService = {
  // Get notifications for the current user
  async getUserNotifications(userId: string, options: { page?: number, limit?: number, unreadOnly?: boolean } = {}) {
    const { page = 1, limit = 20, unreadOnly = false } = options;
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(start, end);
      
    if (unreadOnly) {
      query = query.eq('read', false);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
    
    return {
      notifications: data || [],
      count,
      pages: count ? Math.ceil(count / limit) : 1
    };
  },
  
  // Mark a notification as read
  async markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
      
    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  },
  
  // Mark a notification as unread
  async markAsUnread(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: false })
      .eq('id', id);
      
    if (error) {
      console.error("Error marking notification as unread:", error);
      throw error;
    }
  },
  
  // Mark all notifications as read
  async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId);
      
    if (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },
  
  // Delete a notification
  async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
  
  // Send a notification to a specific user
  async sendNotification(notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        read: false
      })
      .select();
      
    if (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
    
    return data?.[0];
  },
  
  // Send a notification to all users with a specific role
  async sendNotificationToRole(
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read' | 'user_id'>, 
    role: string
  ) {
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
      type: notification.type,
      data: notification.data || {},
      read: false
    }));
    
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationsToInsert)
      .select();
      
    if (error) {
      console.error("Error sending notifications to role:", error);
      throw error;
    }
    
    return data || [];
  },
  
  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, onNewNotification: (notification: Notification) => void) {
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        console.log('New notification received:', payload);
        const newNotification = payload.new as Notification;
        
        // Show a toast notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
        
        // Call the callback with the new notification
        onNewNotification(newNotification);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }
};
