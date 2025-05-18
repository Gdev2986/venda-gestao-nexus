
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from '@/types/notification.types';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationType } from '@/types/enums';

interface NotificationsContextData {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAllAsRead: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  sendNotification: (
    userId: string, 
    title: string, 
    message: string, 
    type: NotificationType, 
    data?: any
  ) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  markAllAsRead: async () => {},
  markAsRead: async () => {},
  markAsUnread: async () => {},
  deleteNotification: async () => {},
  refreshNotifications: async () => {},
  sendNotification: async () => {},
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data) {
        const notificationsData = data.map((item) => ({
          ...item,
          timestamp: new Date(item.created_at),
          read: item.is_read,
        }));
        
        setNotifications(notificationsData);
        setUnreadCount(notificationsData.filter((n) => !n.is_read).length);
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription for notifications
    if (user) {
      const channel = supabase
        .channel('notifications_changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setNotifications(
        notifications.map((n) => ({ ...n, is_read: true, read: true }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      setError(err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: true, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      setError(err);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      setNotifications(
        notifications.map((n) =>
          n.id === id ? { ...n, is_read: false, read: false } : n
        )
      );
      setUnreadCount((prev) => prev + 1);
    } catch (err: any) {
      console.error('Error marking notification as unread:', err);
      setError(err);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw new Error(deleteError.message);
      }

      const deleted = notifications.find((n) => n.id === id);
      setNotifications(notifications.filter((n) => n.id !== id));
      
      if (deleted && !deleted.is_read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      toast({
        title: "Notificação excluída",
        description: "A notificação foi removida com sucesso",
        variant: "default"
      });
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      setError(err);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir esta notificação",
        variant: "destructive"
      });
    }
  };

  const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: any
  ) => {
    try {
      // Convert NotificationType enum to string value for database insertion
      const typeValue = type as unknown as string;
      
      const { error } = await supabase.from('notifications').insert({
        user_id: userId,
        title,
        message,
        type: typeValue,
        is_read: false,
        data,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.error('Error sending notification:', err);
      throw err;
    }
  };

  const value: NotificationsContextData = {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
    markAsRead,
    markAsUnread,
    deleteNotification,
    refreshNotifications: fetchNotifications,
    sendNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
