
import { Notification } from '@/types/notification.types';
import { useHook } from '@/hooks/use-notifications';

// This is a mock service that would be replaced with real API calls
export const useNotificationsService = () => {
  const { 
    fetchNotifications, 
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotif 
  } = useHook();

  // Fetch user notifications
  const fetchUserNotifications = async (userId: string): Promise<Notification[]> => {
    try {
      return await fetchNotifications();
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return [];
    }
  };

  // Mark notification as read
  const markNotificationRead = async (id: string): Promise<void> => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  };

  // Mark all notifications as read
  const markAllNotificationsRead = async (userId: string): Promise<void> => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  };

  // Delete notification
  const deleteNotification = async (id: string): Promise<void> => {
    try {
      if (deleteNotif) {
        await deleteNotif(id);
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  };

  return {
    fetchUserNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  };
};
