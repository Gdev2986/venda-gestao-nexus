
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Notification } from "@/types/notification.types";
import { NotificationsContextProps } from "@/types/notification-context.types";
import { useNotificationStorage } from "@/hooks/use-notification-storage";
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteUserNotification,
  subscribeToNotifications
} from "@/services/notifications.service";
import { supabase } from "@/integrations/supabase/client";

const NotificationsContext = createContext<NotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const { soundEnabled, setSoundEnabled } = useNotificationStorage(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Get the user's role directly from the profile object
  const userRole = profile?.role;

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Set up realtime subscription for new notifications
      const setupRealtimeSubscription = async () => {
        const handleNewNotification = (newNotification: Notification) => {
          // Show toast notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
          
          // Update our notifications state
          setNotifications(prev => [newNotification, ...prev]);
        };
        
        const channel = subscribeToNotifications(user.id, userRole, handleNewNotification, soundEnabled);
        
        return channel;
      };

      const channelPromise = setupRealtimeSubscription();
      
      return () => {
        console.log('Cleaning up notification subscription');
        channelPromise.then(ch => {
          if (ch) supabase.removeChannel(ch);
        });
      };
    }
  }, [user, soundEnabled, userRole, toast]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const data = await fetchUserNotifications(user.id, userRole);
      setNotifications(data);
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
      await markNotificationAsRead(notificationId);
      
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
      await markAllNotificationsAsRead(user.id);

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

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteUserNotification(notificationId);

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
    refreshNotifications,
    soundEnabled,
    setSoundEnabled
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
