
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationService, Notification, NotificationType } from "@/services/NotificationService";
import { UserRole } from "@/types";

interface UseNotificationsParams {
  searchTerm?: string;
  typeFilter?: string;
  statusFilter?: string;
  page?: number;
  pageSize?: number;
}

export const useNotifications = (params: UseNotificationsParams = {}) => {
  const { searchTerm = "", typeFilter = "all", statusFilter = "all", page = 1, pageSize = 50 } = params;
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(page);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = NotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Add the new notification to the list and maintain sort order
        setNotifications(prev => [newNotification, ...prev]);
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
        setTotalCount(prev => prev + 1);
      }
    );
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);
  
  const fetchNotifications = useCallback(async (page = currentPage, limit = pageSize) => {
    if (!user) {
      setIsLoading(false);
      setError("User not authenticated");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Fetch notifications from the service
      const result = await NotificationService.getUserNotifications(user.id, {
        page,
        limit
      });
      
      // Apply client-side filtering
      let filtered = result.notifications;
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(notification => 
          notification.title.toLowerCase().includes(term) ||
          notification.message.toLowerCase().includes(term)
        );
      }
      
      if (typeFilter !== "all") {
        filtered = filtered.filter(notification => notification.type === typeFilter);
      }
      
      if (statusFilter === "read") {
        filtered = filtered.filter(notification => notification.read);
      } else if (statusFilter === "unread") {
        filtered = filtered.filter(notification => !notification.read);
      }
      
      // Get unread count
      const unreadItems = result.notifications.filter(notification => !notification.read);
      
      setNotifications(filtered);
      setUnreadCount(unreadItems.length);
      setTotalPages(result.pages);
      setTotalCount(result.count);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, searchTerm, typeFilter, statusFilter, pageSize, currentPage, toast]);
  
  useEffect(() => {
    fetchNotifications(page);
  }, [fetchNotifications, page]);
  
  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationService.markAsRead(notificationId);
      
      // Update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };
  
  const markAsUnread = async (notificationId: string) => {
    try {
      await NotificationService.markAsUnread(notificationId);
      
      // Update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === notificationId ? { ...notification, read: false } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
    } catch (err) {
      console.error("Error marking notification as unread:", err);
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive",
      });
    }
  };
  
  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await NotificationService.markAllAsRead(user.id);
      
      // Update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    }
  };
  
  const deleteNotification = async (notificationId: string) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      
      // Update UI
      const deletedNotification = notifications.find(notification => notification.id === notificationId);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      // Update unread count if needed
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      // Update total count
      setTotalCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error deleting notification:", err);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    }
  };
  
  const sendNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read'>) => {
    try {
      const result = await NotificationService.sendNotification(notification);
      return result;
    } catch (err) {
      console.error("Error sending notification:", err);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  const sendNotificationToRole = async (
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read' | 'user_id'>,
    role: UserRole
  ) => {
    try {
      const result = await NotificationService.sendNotificationToRole(notification, role);
      return result;
    } catch (err) {
      console.error("Error sending notification to role:", err);
      toast({
        title: "Error",
        description: "Failed to send notification to role",
        variant: "destructive",
      });
      throw err;
    }
  };
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
    fetchNotifications(page);
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    fetchNotifications,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    sendNotificationToRole,
    goToPage,
    refreshNotifications: () => fetchNotifications(currentPage),
  };
};
