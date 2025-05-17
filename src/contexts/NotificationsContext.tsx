import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { Notification } from "@/types";

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  insertMany: (notifications: Omit<Notification, 'id' | 'timestamp'>[]) => Promise<Notification[]>;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
      }

      if (data) {
        // Convert the 'created_at' string to a Date object
        const formattedNotifications = data.map((notification) => ({
          ...notification,
          timestamp: new Date(notification.created_at),
          read: notification.is_read,
        }));
        setNotifications(formattedNotifications);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification = {
              ...(payload.new as any),
              timestamp: new Date((payload.new as any).created_at),
              read: (payload.new as any).is_read,
            };
            setNotifications((prevNotifications) => [
              newNotification,
              ...prevNotifications,
            ]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prevNotifications) =>
              prevNotifications.map((notification) =>
                notification.id === (payload.new as any).id
                  ? {
                      ...notification,
                      ...(payload.new as any),
                      timestamp: new Date((payload.new as any).created_at),
                      read: (payload.new as any).is_read,
                    }
                  : notification
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prevNotifications) =>
              prevNotifications.filter(
                (notification) => notification.id !== (payload.old as any).id
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) {
        console.error("Error marking as read:", error);
      } else {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id);

      if (error) {
        console.error("Error marking all as read:", error);
      } else {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
      } else {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notification) => notification.id !== id)
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const insertMany = async (notifications) => {
    if (!Array.isArray(notifications) || notifications.length === 0) {
      return [];
    }
    
    // Convert NotificationType enum to string for Supabase
    const notificationsWithStringType = notifications.map(n => ({
      ...n,
      type: n.type.toString() // Convert enum to string
    }));
    
    // Insert notifications one by one to avoid type issues
    for (const notification of notificationsWithStringType) {
      await supabase.from('notifications').insert({
        user_id: notification.user_id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        data: notification.data || {},
        is_read: notification.is_read || false
      });
    }
    
    return notifications;
  };

  const value = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    insertMany
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
