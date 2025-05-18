
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationType } from "@/types/notification.types";

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data?: any;
  is_read: boolean;
  created_at: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading?: boolean;
  deleteNotification?: (notificationId: string) => Promise<void>;
  refreshNotifications?: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Realtime subscription
      const channel = supabase
        .channel('public:notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: 'user_id=eq.' + user.id,
          },
          (payload) => {
            console.log('Change received!', payload)
            fetchNotifications();
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [user]);

  useEffect(() => {
    const count = notifications.filter((notification) => !notification.is_read)
      .length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Fix the type casting to ensure compatibility
      setNotifications((data || []).map(item => ({
        ...item,
        type: item.type as NotificationType
      })));
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error fetching notifications",
        description: error.message || "Failed to load notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to mark notification as read. Try again.",
        variant: "destructive",
      });
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
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to mark all notifications as read. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Add deleteNotification function to fix the error
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  // Add refreshNotifications function
  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const value: NotificationsContextProps = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    deleteNotification,
    refreshNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
