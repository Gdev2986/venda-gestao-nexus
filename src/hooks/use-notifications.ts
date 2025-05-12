
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = NotificationService.subscribeToNotifications(
      user.id,
      (newNotification) => {
        // Add the new notification to the list
        setNotifications(prev => [newNotification, ...prev]);
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
      }
    );
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);
  
  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Fetch notifications from the service
      const result = await NotificationService.getUserNotifications(user.id, {
        page,
        limit: pageSize
      });
      
      // Apply client-side filtering - we'd usually do this server-side but
      // for demo purposes we'll do it client-side
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
      setUnreadCount(unreadItems.length);
      
      setNotifications(filtered);
      setTotalPages(result.pages);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notificações",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, page, pageSize, searchTerm, typeFilter, statusFilter, toast]);
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  const markAsRead = async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Erro",
        description: "Falha ao marcar notificação como lida",
        variant: "destructive",
      });
    }
  };
  
  const markAsUnread = async (id: string) => {
    try {
      await NotificationService.markAsUnread(id);
      
      // Update UI
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error("Error marking notification as unread:", error);
      toast({
        title: "Erro",
        description: "Falha ao marcar notificação como não lida",
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
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Erro",
        description: "Falha ao marcar todas notificações como lidas",
        variant: "destructive",
      });
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      
      // Update UI
      const deletedNotification = notifications.find(notification => notification.id === id);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
      
      // Update unread count if needed
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir notificação",
        variant: "destructive",
      });
    }
  };
  
  const sendNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read'>) => {
    try {
      const result = await NotificationService.sendNotification(notification);
      return result;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive",
      });
    }
  };
  
  const sendNotificationToRole = async (
    notification: Omit<Notification, 'id' | 'created_at' | 'updated_at' | 'read' | 'user_id'>,
    role: UserRole
  ) => {
    try {
      const result = await NotificationService.sendNotificationToRole(notification, role);
      return result;
    } catch (error) {
      console.error("Error sending notification to role:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação para função",
        variant: "destructive",
      });
      throw error; // Re-throw to allow component to handle the error
    }
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    sendNotificationToRole,
    totalPages,
    refreshNotifications: fetchNotifications,
  };
};
