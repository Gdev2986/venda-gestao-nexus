
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSoundPreference } from './useSoundPreference';
import { useRealtimeNotifications } from './useRealtimeNotifications';
import { Notification, NotificationsContextProps } from './types';
import { notificationsService } from './notificationsService';

// Create the context with default values
const NotificationsContext = createContext<NotificationsContextProps>({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  isLoading: false,
  deleteNotification: async () => {},
  refreshNotifications: async () => {},
  soundEnabled: true,
  setSoundEnabled: () => {},
});

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useSoundPreference();

  // Subscribe to realtime notifications
  useRealtimeNotifications(async (newNotification) => {
    // If we receive a new notification, refresh the notifications list
    await fetchNotifications();
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Fetch all notifications for the current user
  const fetchNotifications = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userNotifications = await notificationsService.getUserNotifications();
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<void> => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete a notification
  const deleteNotification = async (notificationId: string): Promise<void> => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Refresh notifications
  const refreshNotifications = async (): Promise<void> => {
    await fetchNotifications();
  };

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Context value
  const contextValue: NotificationsContextProps = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    deleteNotification,
    refreshNotifications,
    soundEnabled,
    setSoundEnabled,
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
