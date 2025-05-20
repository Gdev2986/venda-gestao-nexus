
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { Notification, NotificationsContextProps } from "./types";
import { 
  fetchUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteUserNotification 
} from "./notificationsService";
import { useSoundPreference } from "./useSoundPreference";
import { useRealtimeNotifications } from "./useRealtimeNotifications";
import { NotificationType } from "@/types";

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useSoundPreference();
  const { user } = useAuth();

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const data = await fetchUserNotifications(user.id);
      
      // Fix the type casting to ensure compatibility
      setNotifications(data.map(item => ({
        ...item,
        type: item.type as NotificationType
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const success = await markNotificationAsRead(notificationId);
    
    if (success) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    const success = await markAllNotificationsAsRead(user.id);
    
    if (success) {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, is_read: true }))
      );
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const success = await deleteUserNotification(notificationId);
    
    if (success) {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    }
  };

  const refreshNotifications = fetchNotifications;

  const handleNewNotification = (newNotification: Notification) => {
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Setup realtime subscription
  useRealtimeNotifications(
    user?.id,
    soundEnabled,
    handleNewNotification,
    fetchNotifications
  );

  // Initial fetch when user is available
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

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
