
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationService, Notification } from "@/services/NotificationService";

interface UseNotificationsOptions {
  statusFilter?: string;
  typeFilter?: string;
  searchTerm?: string;
  page?: number;
  pageSize?: number;
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Format options
  const formattedOptions = {
    page: options.page || 1,
    pageSize: options.pageSize || 10,
    statusFilter: options.statusFilter || "all",
    typeFilter: options.typeFilter || "all",
    searchTerm: options.searchTerm || "",
  };

  // Fetch notifications with React Query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "notifications",
      user?.id,
      formattedOptions.page,
      formattedOptions.pageSize,
      formattedOptions.statusFilter,
      formattedOptions.typeFilter,
      formattedOptions.searchTerm,
    ],
    queryFn: async () => {
      if (!user) {
        return { notifications: [], count: 0 };
      }

      const result = await NotificationService.getUserNotifications(
        user.id,
        formattedOptions
      );
      return result;
    },
    enabled: !!user,
  });

  // Calculate total pages
  const totalPages = Math.ceil((data?.count || 0) / formattedOptions.pageSize);

  // Fetch unread count separately
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0);
        return;
      }

      try {
        const count = await NotificationService.getUnreadCount(user.id);
        setUnreadCount(count);
      } catch (error) {
        console.error("Error getting unread count:", error);
      }
    };

    fetchUnreadCount();
    
    // Optional: Set up real-time subscription for notifications
    if (user) {
      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchUnreadCount();
            refetch();
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, refetch]);

  // Methods for notification management
  const markAsRead = async (notificationId: string) => {
    if (!user) return;
    await NotificationService.markAsRead(notificationId);
    // Atualizar a contagem de não lidas
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAsUnread = async (notificationId: string) => {
    if (!user) return;
    await NotificationService.markAsUnread(notificationId);
    // Atualizar a contagem de não lidas
    setUnreadCount(prev => prev + 1);
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await NotificationService.markAllAsRead(user.id);
    // Todas as notificações foram lidas
    setUnreadCount(0);
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user) return;
    await NotificationService.deleteNotification(notificationId);
    // Refetching needed to update the count properly
  };

  const refresh = refetch;

  return {
    notifications: data?.notifications || [],
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    refresh,
    totalPages,
  };
};

// Importe o cliente Supabase para uso nas inscrições em tempo real
import { supabase } from "@/integrations/supabase/client";
