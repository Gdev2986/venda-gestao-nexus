
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import NotificationService from '@/services/NotificationService';
import { toast } from '@/hooks/use-toast';
import { NotificationType } from '@/types';

// Response types should match NotificationService
interface Notification {
  id: string;
  user_id: string;
  type: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
  title: string;
  message: string;
}

interface NotificationResponse {
  notifications: Notification[];
  totalCount: number;
  totalPages: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { user } = useAuth();
  
  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, limit = 10) => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await NotificationService.getForUser(user.id, page, limit);
      
      setNotifications(response.notifications);
      setTotalCount(response.totalCount);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
      
      // Update unread count
      const count = await NotificationService.getUnreadCount(user.id);
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
  }, [user, toast]);
  
  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user) return false;
    
    try {
      const success = await NotificationService.markAsRead(notificationId);
      
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
  
  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return false;
    
    try {
      const success = await NotificationService.markAllAsRead(user.id);
      
      if (success) {
        // Update local state
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
      
      return success;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  }, [user]);
  
  // Load notifications on initial render
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);
  
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
    markAllAsRead,
    goToPage: (page: number) => fetchNotifications(page),
  };
};
