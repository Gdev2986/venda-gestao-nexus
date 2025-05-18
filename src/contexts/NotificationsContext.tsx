
import { createContext, useContext, useEffect, useState } from "react";
import { Notification, NotificationType } from "@/types/notification.types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast as showToast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface NotificationsContextData {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAllAsRead: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      subscribeToNotifications();
    } else {
      setNotifications([]);
      setLoading(false);
    }

    return () => {
      supabase.removeAllChannels();
    };
  }, [user?.id]);

  // Subscribe to real-time notifications
  const subscribeToNotifications = () => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        handleNewNotification(payload.new as any);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Handle incoming notification
  const handleNewNotification = (notification: any) => {
    const newNotification: Notification = {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type as NotificationType,
      is_read: notification.is_read || false,
      created_at: notification.created_at,
      data: notification.data,
      user_id: notification.user_id,
      read: notification.is_read || false,
      timestamp: new Date(notification.created_at),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show a toast for the new notification
    showToast(notification.title, {
      description: notification.message,
      duration: 5000,
    });
  };

  // Fetch notifications from the database
  const fetchNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Adapt data format
      const adaptedData = data.map((item): Notification => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        message: item.message,
        type: item.type as unknown as NotificationType, // Use the defined enum
        is_read: item.is_read || false,
        data: item.data as any,
        created_at: item.created_at,
        // Add backward compatibility fields
        read: item.is_read || false,
        timestamp: new Date(item.created_at),
      }));

      setNotifications(adaptedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true, read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark a notification as unread
  const markAsUnread = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: false, read: false }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as unread:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id || notifications.length === 0) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) {
        throw error;
      }

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, is_read: true, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Manually refresh notifications
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Create a notification (only for admin users)
  const createNotification = async (
    userId: string,
    title: string,
    message: string,
    type: string,
    data?: any
  ) => {
    if (!user?.id) return;

    try {
      // Use "as any" temporarily to bypass the type check
      // This is a workaround for the database schema vs. our app's type system
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type: type as any,
        is_read: false,
        data
      } as any);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        markAsUnread,
        deleteNotification,
        refreshNotifications
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = (): NotificationsContextData => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};
