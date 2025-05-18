
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  loading: boolean;
  isLoading: boolean;
  sendNotification: (userId: string, title: string, message: string, type: NotificationType, data?: Record<string, any>) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>;
}

export const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  refreshNotifications: async () => {},
  loading: false,
  isLoading: false,
  sendNotification: async () => {},
  markAsUnread: async () => {},
});

export const useNotifications = (): NotificationsContextType => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        // Convert the database notification format to our app's Notification type
        const appNotifications = data.map((dbNotif): Notification => ({
          id: dbNotif.id,
          title: dbNotif.title,
          message: dbNotif.message,
          type: dbNotif.type as NotificationType,
          is_read: dbNotif.is_read,
          timestamp: dbNotif.created_at,
          data: dbNotif.data
        }));

        setNotifications(appNotifications);
        setUnreadCount(appNotifications.filter(n => !n.is_read).length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar suas notificações."
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchNotifications();

    // Set up real-time listener for new notifications
    if (user) {
      const channel = supabase
        .channel('notifications-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          console.log('Notification change received', payload);
          fetchNotifications();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchNotifications]);

  const sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ) => {
    try {
      const { error } = await supabase.from("notifications").insert({
        title,
        message,
        type: type as string,
        user_id: userId,
        is_read: false,
        data
      });

      if (error) throw error;
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível enviar a notificação."
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: false })
        .eq("id", notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => (n.id === notificationId ? { ...n, is_read: false } : n))
      );
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) throw error;

      const wasUnread = notifications.find(n => n.id === notificationId)?.is_read === false;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const refreshNotifications = fetchNotifications;

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    loading: isLoading,
    isLoading,
    sendNotification,
    markAsUnread
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
