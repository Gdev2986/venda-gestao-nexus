
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './types';
import { useAuth } from '@/providers/AuthProvider';

// Create the notifications service with proper methods
export const notificationsService = {
  getUserNotifications: async (): Promise<Notification[]> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('No session found, cannot fetch notifications');
      return [];
    }

    const userId = session.session.user.id;
    
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    
    return data || [];
  },
  
  markAsRead: async (notificationId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
      
    if (error) {
      console.error(`Error marking notification ${notificationId} as read:`, error);
    }
  },
  
  markAllAsRead: async (): Promise<void> => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.error('No session found, cannot mark notifications as read');
      return;
    }

    const userId = session.session.user.id;
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);
      
    if (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },
  
  deleteNotification: async (notificationId: string): Promise<void> => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
      
    if (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
    }
  }
};
