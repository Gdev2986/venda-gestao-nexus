
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import notificationService from '@/services/NotificationService';
import { toast } from '@/hooks/use-toast';
import { NotificationType, UserRole, Notification } from '@/types';

interface UseNotificationsOptions {
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
  unreadOnly?: boolean;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(options.page || 1);
  const { user } = useAuth();
  
  // Fetch notifications
  const fetchNotifications = useCallback(async (page = currentPage, limit = options.pageSize || 10) => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await notificationService.getForUser(user.id, page, limit, {
        typeFilter: options.typeFilter,
        statusFilter: options.statusFilter,
        searchTerm: options.searchTerm,
        unreadOnly: options.unreadOnly
      });
      
      setNotifications(response.notifications);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      
      // Update unread count
      const count = await notificationService.getUnreadCount(user.id);
      setUnreadCount(count);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message || 'Failed to load notifications');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load notifications'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, options, currentPage, toast]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return false;
    
    try {
      const success = await notificationService.markAsRead(notificationId);
      
      if (success) {
        // Update local state
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      return success;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  }, [user]);

  // Mark notification as unread
  const markAsUnread = useCallback(async (notificationId: string) => {
    if (!user) return false;
    
    try {
      const success = await notificationService.markAsUnread(notificationId);
      
      if (success) {
        // Update local state
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, is_read: false } : n
        ));
        setUnreadCount(prev => prev + 1);
      }
      
      return success;
    } catch (err) {
      console.error('Error marking notification as unread:', err);
      return false;
    }
  }, [user]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    if (!user) return false;
    
    try {
      const success = await notificationService.deleteNotification(notificationId);
      
      if (success) {
        // Update local state
        const deleted = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        // If it was unread, update unread count
        if (deleted && !deleted.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting notification:', err);
      return false;
    }
  }, [user, notifications]);
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return false;
    
    try {
      const result = await notificationService.markAllAsRead(user.id);
      
      if (result.success) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
      
      return result.success;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [user]);

  // Create notification - convenience method
  const createNotification = useCallback(async (
    title: string, 
    message: string, 
    type: NotificationType, 
    userId: string = '',
    data: Record<string, any> = {}
  ) => {
    return notificationService.createNotification(title, message, type, userId, data);
  }, []);

  // Send notification to role - convenience method
  const sendNotificationToRole = useCallback(async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole
  ) => {
    return notificationService.sendToRole(role, title, message, type);
  }, []);
  
  // Load notifications on initial render
  useEffect(() => {
    if (user) {
      fetchNotifications(currentPage, options.pageSize || 10);
    }
  }, [user, currentPage, options.pageSize, fetchNotifications]);
  
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
    deleteNotification,
    markAllAsRead,
    createNotification,
    sendNotificationToRole,
    goToPage: (page: number) => fetchNotifications(page),
    refreshNotifications: () => fetchNotifications(currentPage, options.pageSize || 10),
  };
};
