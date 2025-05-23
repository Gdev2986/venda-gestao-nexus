
import { useState, useCallback } from 'react';
import { Notification } from '@/types/notification.types';
import { useToast } from "@/hooks/use-toast";
import { useNotificationsService } from './useNotificationsService';

export const useNotificationsState = (userId?: string, soundEnabled?: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const { fetchUserNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification: deleteNotificationService } = useNotificationsService();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return [];
    
    setIsLoading(true);
    try {
      const fetchedNotifications = await fetchUserNotifications(userId);
      setNotifications(fetchedNotifications);
      
      const unread = fetchedNotifications.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      
      return fetchedNotifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar notificações",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchUserNotifications, toast]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    if (!userId) return;
    
    try {
      markNotificationRead(id);
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? {...n, is_read: true} : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, [userId, markNotificationRead]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    if (!userId || notifications.length === 0) return;
    
    try {
      markAllNotificationsRead(userId);
      
      setNotifications(prev => 
        prev.map(n => ({...n, is_read: true}))
      );
      
      setUnreadCount(0);
      
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas"
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas",
        variant: "destructive"
      });
    }
  }, [userId, notifications, markAllNotificationsRead, toast]);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    if (!userId) return;
    
    try {
      deleteNotificationService(id);
      
      setNotifications(prev => 
        prev.filter(n => n.id !== id)
      );
      
      // Update unread count if needed
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.is_read ? Math.max(0, prev - 1) : prev;
      });
      
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso"
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a notificação",
        variant: "destructive"
      });
    }
  }, [userId, notifications, deleteNotificationService, toast]);

  return {
    notifications,
    setNotifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications
  };
};
