
import { useState, useEffect } from "react";
import { notificationService, Notification } from "@/services/NotificationService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const { toast } = useToast();
  
  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase.channel('notifications-changes')
      .on('postgres_changes', 
          { event: '*', 
            schema: 'public', 
            table: 'notifications' 
          }, 
          handleNotificationChange)
      .subscribe();
    
    return () => { 
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleNotificationChange = (payload: any) => {
    console.log("Notification change detected:", payload);
    // Refresh notifications when a change is detected
    fetchNotifications();
  };
  
  useEffect(() => {
    fetchNotifications();
  }, [searchTerm, typeFilter, statusFilter, page]);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    
    try {
      const allNotifications = await notificationService.getUserNotifications();
      
      // Apply filters
      let filtered = allNotifications;
      
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
      
      // Calculate pagination
      const total = filtered.length;
      const maxPages = Math.ceil(total / pageSize);
      setTotalPages(maxPages || 1);
      
      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const paginatedNotifications = filtered.slice(startIndex, startIndex + pageSize);
      
      setNotifications(paginatedNotifications);
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
  };
  
  const markAsRead = async (id: string) => {
    try {
      const success = await notificationService.markAsRead(id);
      if (success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
          )
        );
      }
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
      const success = await notificationService.markAsUnread(id);
      if (success) {
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === id ? { ...notification, read: false } : notification
          )
        );
      }
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
    try {
      const success = await notificationService.markAllAsRead();
      if (success) {
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
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
      const success = await notificationService.deleteNotification(id);
      if (success) {
        setNotifications(prev =>
          prev.filter(notification => notification.id !== id)
        );
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
  
  const deleteAllNotifications = async () => {
    try {
      const success = await notificationService.deleteAllNotifications();
      if (success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir todas as notificações",
        variant: "destructive",
      });
    }
  };
  
  const sendNotification = async (userId: string, title: string, message: string, type: string, data?: any) => {
    try {
      const success = await notificationService.sendNotification(userId, title, message, type, data);
      return success;
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive",
      });
      return false;
    }
  };
  
  const refreshNotifications = () => {
    fetchNotifications();
  };
  
  return {
    notifications,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    sendNotification,
    totalPages,
    refreshNotifications,
  };
};
