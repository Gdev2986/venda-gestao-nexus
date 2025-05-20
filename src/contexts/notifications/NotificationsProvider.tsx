
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Notification } from './types';
import { notificationsService } from './notificationsService';
import { useRealtimeNotifications } from './useRealtimeNotifications';
import { useSoundPreference } from './useSoundPreference';
import { toast } from '@/hooks/use-toast';

// Create the context
interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useSoundPreference();

  // Calculate unread count
  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userNotifications = await notificationsService.getUserNotifications();
        setNotifications(userNotifications);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  // Handle realtime notifications
  useRealtimeNotifications((newNotification) => {
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: newNotification.title,
      description: newNotification.message,
    });
    
    // Play sound if enabled
    if (soundEnabled) {
      // Get the appropriate sound file based on notification type
      const audioFile = getNotificationSoundFile(newNotification.type);
      const audio = new Audio(audioFile);
      audio.play().catch(err => console.error('Error playing notification sound:', err));
    }
  });

  // Helper to get the appropriate sound file
  const getNotificationSoundFile = (type: string) => {
    switch (type) {
      case 'SUPPORT':
        return '/sounds/notification-support.mp3';
      case 'LOGISTICS':
        return '/sounds/notification-logistics.mp3';
      default:
        return '/sounds/notification-general.mp3';
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive"
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas.",
        variant: "destructive"
      });
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationsService.deleteNotification(notificationId);
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a notificação.",
        variant: "destructive"
      });
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    soundEnabled,
    setSoundEnabled
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook for using the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
