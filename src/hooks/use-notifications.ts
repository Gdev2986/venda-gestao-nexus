
import { useState, useEffect, useCallback } from "react";
import { NotificationType, UserRole, Notification } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

// Mock NotificationService to be replaced with actual implementation
const NotificationService = {
  getNotifications: async (
    userId: string,
    page: number,
    pageSize: number,
    typeFilter?: string,
    statusFilter?: string,
    searchTerm?: string
  ) => {
    // Mock implementation
    return {
      notifications: [],
      totalCount: 0
    };
  },
  markAsRead: async (id: string) => {},
  markAsUnread: async (id: string) => {},
  markAllAsRead: async (userId: string) => {},
  deleteNotification: async (id: string) => {},
  createNotification: async (params: {
    title: string;
    message: string;
    type: NotificationType;
    user_id: string;
    data?: Record<string, any>;
  }) => {},
  sendNotificationToRole: async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data: Record<string, any> = {}
  ) => {}
};

interface UseNotificationsProps {
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
}

export function useNotifications({
  page = 1,
  pageSize = 10,
  typeFilter = 'all',
  statusFilter = 'all',
  searchTerm = ''
}: UseNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await NotificationService.getNotifications(
        user.id, 
        page, 
        pageSize, 
        typeFilter, 
        statusFilter,
        searchTerm
      );
      
      setNotifications(result.notifications);
      setTotalCount(result.totalCount);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, page, pageSize, typeFilter, statusFilter, searchTerm]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAsUnread = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsUnread(id);
      
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as unread:", error);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
      
      // Update total count after deletion
      setTotalCount((prev) => (prev > 0 ? prev - 1 : 0));
      // Recalculate total pages
      setTotalPages((prev) => Math.max(1, Math.ceil((totalCount - 1) / pageSize)));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [totalCount, pageSize]);

  const markAllAsRead = useCallback(async (userId: string) => {
    if (!userId) return;
    
    try {
      await NotificationService.markAllAsRead(userId);
      
      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const createNotification = useCallback(async (
    title: string,
    message: string,
    type: NotificationType,
    userId: string,
    data: Record<string, any> = {}
  ) => {
    try {
      await NotificationService.createNotification({
        title,
        message,
        type,
        user_id: userId,
        data
      });
    } catch (error) {
      console.error("Error creating notification:", error);
    }
  }, []);

  // Add the sendNotificationToRole function
  const sendNotificationToRole = useCallback(async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data: Record<string, any> = {}
  ) => {
    try {
      await NotificationService.sendNotificationToRole(
        title,
        message,
        type,
        role,
        data
      );
      return true;
    } catch (error) {
      console.error("Error sending notification to role:", error);
      return false;
    }
  }, []);

  return {
    notifications,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    totalCount,
    totalPages,
    refreshNotifications,
    createNotification,
    sendNotificationToRole
  };
}
