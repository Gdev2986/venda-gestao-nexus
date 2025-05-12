
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/NotificationService";
import { DatabaseNotificationType } from "@/types";
import { toast } from "@/components/ui/sonner";

export const useNotifications = (initialPage = 1, pageSize = 10) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['notifications', user?.id, currentPage, pageSize, typeFilter, statusFilter],
    queryFn: async () => {
      if (!user?.id) return { notifications: [], count: 0 };
      return await notificationService.getNotifications({
        userId: user.id,
        page: currentPage,
        pageSize,
        typeFilter,
        statusFilter,
      });
    },
    enabled: !!user?.id,
  });

  const notifications = data?.notifications || [];
  const totalPages = data?.count ? Math.ceil(data.count / pageSize) : 1;

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  const markAsUnreadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsUnread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success("Notificação excluída com sucesso");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    onError: () => {
      toast.error("Erro ao excluir notificação");
    }
  });

  const sendNotification = useMutation({
    mutationFn: (params: {
      title: string;
      message: string;
      type: DatabaseNotificationType;
      recipients: {
        role?: any;
        userId?: string;
      };
      data?: Record<string, any>;
    }) => notificationService.sendNotification(params),
    onSuccess: () => {
      toast.success("Notificação enviada com sucesso");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error("Erro ao enviar notificação");
    }
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle type filter change
  const handleTypeFilterChange = (type: string) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle status filter change
  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const { data: unreadCountData } = useQuery({
    queryKey: ['unreadCount', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      return await notificationService.getUnreadCount(user.id);
    },
    enabled: !!user?.id,
  });

  const unreadCount = unreadCountData || 0;

  return {
    notifications,
    isLoading,
    error,
    currentPage,
    totalPages,
    unreadCount,
    typeFilter,
    statusFilter,
    handlePageChange,
    handleTypeFilterChange,
    handleStatusFilterChange,
    markAsRead: markAsReadMutation.mutate,
    markAsUnread: markAsUnreadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    sendNotification: sendNotification.mutate,
    refetchNotifications: refetch,
  };
};
