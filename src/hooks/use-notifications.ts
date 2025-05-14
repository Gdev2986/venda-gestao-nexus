
import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NotificationService, Notification, NotificationType, CreateNotificationDto } from "@/services/NotificationService";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

interface UseNotificationsOptions {
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
}

/**
 * Hook for managing notifications
 */
export function useNotifications(options: UseNotificationsOptions = {}) {
  const { user } = useAuth();
  const userId = user?.id || "";
  const queryClient = useQueryClient();
  const [totalPages, setTotalPages] = useState(1);

  const {
    page = 1,
    pageSize = 10,
    typeFilter = "all",
    statusFilter = "all",
    searchTerm = "",
  } = options;

  // Fetch notifications
  const {
    data,
    isLoading,
    refetch: refresh
  } = useQuery({
    queryKey: ["notifications", userId, page, pageSize, typeFilter, statusFilter, searchTerm],
    queryFn: async () => {
      if (!userId) {
        return { notifications: [], count: 0 };
      }
      
      const result = await NotificationService.getUserNotifications(userId, {
        page,
        pageSize,
        typeFilter,
        statusFilter,
        searchTerm,
      });
      
      // Calculate total pages
      setTotalPages(Math.ceil(result.count / pageSize) || 1);
      
      return result;
    },
    enabled: !!userId,
  });

  // Get unread count
  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread", userId],
    queryFn: async () => {
      if (!userId) return 0;
      return await NotificationService.getUnreadCount(userId);
    },
    enabled: !!userId,
  });

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
  }, [queryClient]);

  // Mark notification as unread
  const markAsUnread = useCallback(async (notificationId: string) => {
    await NotificationService.markAsUnread(notificationId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
  }, [queryClient]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!userId) return;
    await NotificationService.markAllAsRead(userId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
  }, [queryClient, userId]);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    await NotificationService.deleteNotification(notificationId);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
  }, [queryClient]);

  // Send notification to role
  const sendNotificationToRole = useCallback(async (
    notification: CreateNotificationDto,
    role: UserRole
  ) => {
    await NotificationService.sendNotificationToRole(notification, role);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  // Setup real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, () => {
        // Invalidate queries to refresh data
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
        queryClient.invalidateQueries({ queryKey: ["notifications-unread"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return {
    notifications: data?.notifications || [],
    unreadCount: unreadData || 0,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    sendNotificationToRole,
    totalPages,
    refresh
  };
}
