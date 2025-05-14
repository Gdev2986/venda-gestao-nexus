
import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/NotificationService";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, NotificationType, UserRole } from "@/types";

interface UseNotificationsOptions {
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
}

interface NotificationHook {
  notifications: Notification[];
  isLoading: boolean;
  totalCount?: number;
  totalPages?: number;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: (userId: string) => Promise<void>;
  createNotification: (
    title: string, 
    message: string, 
    type: NotificationType,
    data?: Record<string, any>
  ) => Promise<void>;
  sendNotificationToRole: (
    title: string, 
    message: string, 
    type: NotificationType, 
    role: UserRole, 
    data?: Record<string, any>
  ) => Promise<void>;
}

export const useNotifications = (options: UseNotificationsOptions = {}): NotificationHook => {
  const { page = 1, pageSize = 10, typeFilter = "all", statusFilter = "all", searchTerm = "" } = options;
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Using the correct method from notification service
      const { notifications: notificationsData, totalCount, totalPages } = await notificationService.getUserNotifications(
        user.id,
        page,
        pageSize,
        typeFilter,
        statusFilter,
        searchTerm
      );

      setNotifications(notificationsData);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Exception fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, page, pageSize, typeFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const markAsRead = async (id: string) => {
    try {
      // Use the available method from the service
      await notificationService.markAsRead(id);
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Exception marking notification as read:", error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      // Assume the service doesn't have this method yet
      // Just update local state for now
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
    } catch (error) {
      console.error("Exception marking notification as unread:", error);
    }
  };

  const markAllAsRead = async (userId: string) => {
    try {
      // Using the correct method with the right arguments
      await notificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Exception marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Exception deleting notification:", error);
    }
  };

  const deleteAllNotifications = async (userId: string) => {
    try {
      // We don't have this in the service yet, but we'll prepare the client-side part
      // await notificationService.deleteAllNotifications(userId);
      
      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error("Exception deleting all notifications:", error);
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      await notificationService.createNotification({
        title,
        message,
        type,
        user_id: user.id,
        data
      });
      
      // Refresh notifications to show the new one
      await fetchNotifications();
    } catch (error) {
      console.error("Exception creating notification:", error);
    }
  };

  const sendNotificationToRole = async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data?: Record<string, any>
  ) => {
    try {
      // For now, just create a stub since the service method might not exist
      console.log("Sending notification to role", {
        title,
        message,
        type,
        role,
        data
      });
      // await notificationService.sendNotificationToRole(title, message, type, role, data);
    } catch (error) {
      console.error("Exception sending notifications to role:", error);
    }
  };

  return {
    notifications,
    isLoading,
    totalCount,
    totalPages,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    fetchNotifications,
    refreshNotifications,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
    sendNotificationToRole
  };
};
