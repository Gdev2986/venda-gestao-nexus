
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  user_id?: string;
  status?: 'read' | 'unread';
  type?: string;
  link?: string;
}

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getUserNotifications(userId?: string): Promise<Notification[]> {
    try {
      const { data: session } = await supabase.auth.getSession();
      const currentUserId = userId || session.session?.user.id;
      
      if (!currentUserId) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('id', notificationId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  async markAllAsRead(userId?: string): Promise<void> {
    try {
      const { data: session } = await supabase.auth.getSession();
      const currentUserId = userId || session.session?.user.id;
      
      if (!currentUserId) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ status: 'read' })
        .eq('user_id', currentUserId)
        .eq('status', 'unread');
      
      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }

  async createNotification(notification: Partial<Notification>): Promise<Notification | null> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([
          { 
            ...notification, 
            status: notification.status || 'unread',
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();
