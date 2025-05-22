
import React, { createContext, useContext, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNotificationsState } from "./useNotificationsState";
import { useNotificationsSubscription } from "./useNotificationsSubscription";
import { useNotificationSound } from "./useNotificationSound";
import { NotificationsContextProps } from "./types";
import { requestNotificationPermission } from "@/components/notifications/NotificationToast";

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { soundEnabled, setSoundEnabled } = useNotificationSound();
  
  const {
    notifications,
    setNotifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    deleteNotification,
    refreshNotifications
  } = useNotificationsState(user?.id, soundEnabled);

  // Solicitar permissão para notificações quando o provedor for montado
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Set up realtime subscription
  useNotificationsSubscription(
    user?.id, 
    soundEnabled, 
    setNotifications, 
    fetchNotifications
  );

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
