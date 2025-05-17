
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification, NotificationType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/hooks/use-user';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useUser();
  
  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      
      // Transform to match our Notification interface
      const formattedNotifications: Notification[] = data.map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        created_at: item.created_at,
        is_read: item.is_read,
        data: item.data,
        // Add backwards compatibility aliases
        read: item.is_read,
        timestamp: item.created_at
      }));
      
      setNotifications(formattedNotifications);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load notifications'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, is_read: true, read: true } 
            : notification
        )
      );
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark notification as read'
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true, read: true }))
      );
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark all notifications as read'
      });
    }
  };
  
  // Listen for new notifications in real-time
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('notification_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as any;
          // Transform to match our Notification interface
          const formattedNotification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type as NotificationType,
            created_at: newNotification.created_at, // Using string format
            is_read: newNotification.is_read,
            data: newNotification.data,
            // Add backwards compatibility aliases
            read: newNotification.is_read,
            timestamp: newNotification.created_at
          };
          
          setNotifications((prev) => [formattedNotification, ...prev]);
          
          toast({
            title: formattedNotification.title,
            description: formattedNotification.message,
          });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, toast]);
  
  // Fetch notifications on initial load and when user changes
  useEffect(() => {
    fetchNotifications();
  }, [user]);
  
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        isLoading, 
        markAsRead, 
        markAllAsRead,
        refreshNotifications: fetchNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
