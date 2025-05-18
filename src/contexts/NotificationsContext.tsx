
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationType } from "@/types/notification.types";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  data?: any;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  sendNotification: (userId: string, title: string, message: string, type: NotificationType, data?: any) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  markAsUnread: async () => {},
  deleteNotification: async () => {},
  refreshNotifications: async () => {},
  sendNotification: async () => {},
});

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert DB data to Notification type
      const typedNotifications = data?.map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        is_read: item.is_read,
        created_at: item.created_at,
        data: item.data
      })) || [];

      setNotifications(typedNotifications);
      setUnreadCount(typedNotifications.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    if (user) {
      const channel = supabase
        .channel('notification-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
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

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAsUnread = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Error marking notification as unread:', error);
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
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      
      toast({
        title: 'Notificações',
        description: 'Todas as notificações foram marcadas como lidas'
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar as notificações como lidas',
        variant: 'destructive'
      });
    }
  };
  
  const deleteNotification = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Update local state
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: 'Notificação removida',
        description: 'A notificação foi excluída com sucesso'
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a notificação',
        variant: 'destructive'
      });
    }
  };
  
  const refreshNotifications = async () => {
    await fetchNotifications();
    toast({
      title: 'Notificações atualizadas',
      description: 'As notificações foram atualizadas com sucesso'
    });
  };
  
  const sendNotification = async (userId: string, title: string, message: string, type: NotificationType, data?: any) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            title,
            message,
            type,
            data: data || {},
            is_read: false
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: 'Notificação enviada',
        description: 'A notificação foi enviada com sucesso'
      });
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a notificação',
        variant: 'destructive'
      });
    }
  };

  // Add the event listeners for real-time updates
  useEffect(() => {
    fetchNotifications();
    
    if (user) {
      const channel = supabase
        .channel('notification-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
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

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    markAsUnread,
    deleteNotification,
    refreshNotifications,
    sendNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationsContext);
