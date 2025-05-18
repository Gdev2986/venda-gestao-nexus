
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, NotificationType } from "@/types/notification.types";
import { useToast } from "@/hooks/use-toast";

interface NotificationsContextData {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendNotification: (userId: string, notification: {
    title: string;
    message: string;
    type: NotificationType;
    data?: any;
  }) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextData>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  sendNotification: async () => {},
});

export function useNotifications() {
  return useContext(NotificationsContext);
}

interface NotificationsProviderProps {
  children: ReactNode;
}

export function NotificationsProvider({ children }: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch notifications for the user
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        throw error;
      }

      // Transform to Notification type
      const transformedNotifications: Notification[] = data || [];

      // Count unread notifications
      const unreadNotifications = transformedNotifications.filter(
        (notification) => !notification.is_read
      );

      setNotifications(transformedNotifications);
      setUnreadCount(unreadNotifications.length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      // Update in database
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      // Update in database
      const { error } = await supabase
        .from("notifications")
        .update({
          is_read: true,
        })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) {
        throw error;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  const sendNotification = async (userId: string, notification: {
    title: string;
    message: string;
    type: NotificationType;
    data?: any;
  }) => {
    try {
      // Create the notification object with the correct shape
      const notificationData = {
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        is_read: false,
        data: notification.data || {}
      };
      
      const { error } = await supabase
        .from("notifications")
        .insert(notificationData);

      if (error) {
        throw error;
      }

      // Success notification
      toast({
        title: "Notificação enviada",
        description: "A notificação foi enviada com sucesso.",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificação",
        description:
          "Não foi possível enviar a notificação. Tente novamente mais tarde.",
      });
    }
  };

  // Set up a listener for real-time notifications
  useEffect(() => {
    if (!user) return;

    // Subscribe to changes on the notifications table for this user
    const subscription = supabase
      .channel("notifications-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen for all events
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            // Add new notification to the list
            const newNotification = payload.new as Notification;

            setNotifications((prev) => [newNotification, ...prev]);
            if (!newNotification.is_read) {
              setUnreadCount((prev) => prev + 1);
            }

            // Show a toast for new notifications
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          } else if (payload.eventType === "UPDATE") {
            // Update existing notification
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === payload.new.id
                  ? {
                      ...n,
                      title: payload.new.title,
                      message: payload.new.message,
                      is_read: payload.new.is_read,
                    }
                  : n
              )
            );

            // Recalculate unread count
            setNotifications((prevNotifications) => {
              const unreadCount = prevNotifications.filter(
                (notification) => !notification.is_read
              ).length;
              setUnreadCount(unreadCount);
              return prevNotifications;
            });
          } else if (payload.eventType === "DELETE") {
            // Remove notification
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            );

            // Recalculate unread count
            setNotifications((prevNotifications) => {
              const unreadCount = prevNotifications.filter(
                (notification) => !notification.is_read
              ).length;
              setUnreadCount(unreadCount);
              return prevNotifications;
            });
          }
        }
      )
      .subscribe();

    // Fetch existing notifications
    fetchNotifications();

    // Clean up subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const value = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    sendNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
