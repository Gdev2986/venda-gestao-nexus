
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/NotificationService";
import { DatabaseNotificationType, UserRole, Notification } from "@/types";
import { toast } from "sonner";

interface GetNotificationsParams {
  userId: string;
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
}

export const useNotifications = (initialParams: {
  page?: number;
  pageSize?: number;
  typeFilter?: string;
  statusFilter?: string;
  searchTerm?: string;
} = { page: 1, pageSize: 10 }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [pageSize] = useState(initialParams.pageSize || 10);
  const [typeFilter, setTypeFilter] = useState(initialParams.typeFilter || 'all');
  const [statusFilter, setStatusFilter] = useState(initialParams.statusFilter || 'all');
  const [searchTerm, setSearchTerm] = useState(initialParams.searchTerm || '');
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['notifications', user?.id, currentPage, pageSize, typeFilter, statusFilter, searchTerm],
    queryFn: async () => {
      if (!user?.id) return { notifications: [], count: 0 };
      return await notificationService.getNotifications({
        userId: user.id,
        page: currentPage,
        pageSize,
        typeFilter,
        statusFilter,
        searchTerm
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

  const markAllAsReadMutation = useMutation({
    mutationFn: (userId: string) => notificationService.markAllAsRead(userId),
    onSuccess: () => {
      toast.success("All notifications marked as read");
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

  const sendNotificationMutation = useMutation({
    mutationFn: (params: {
      title: string;
      message: string;
      type: DatabaseNotificationType;
      recipients: {
        role?: UserRole;
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

  const sendNotificationToRoleMutation = useMutation({
    mutationFn: (params: {
      title: string;
      message: string;
      type: DatabaseNotificationType;
      role: UserRole;
      data?: Record<string, any>;
    }) => {
      return notificationService.sendNotificationToRole(
        params.title,
        params.message,
        params.type,
        params.role,
        params.data
      );
    },
    onSuccess: () => {
      toast.success("Notificação enviada com sucesso para o grupo");
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      toast.error("Erro ao enviar notificação para o grupo");
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
  
  // Handle search term change
  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const refreshNotifications = (filters?: {
    page?: number;
    typeFilter?: string;
    statusFilter?: string;
    searchTerm?: string;
  }) => {
    if (filters?.page !== undefined) setCurrentPage(filters.page);
    if (filters?.typeFilter !== undefined) setTypeFilter(filters.typeFilter);
    if (filters?.statusFilter !== undefined) setStatusFilter(filters.statusFilter);
    if (filters?.searchTerm !== undefined) setSearchTerm(filters.searchTerm);
    
    // Always refetch after changing filters
    return refetch();
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
    searchTerm,
    handlePageChange,
    handleTypeFilterChange,
    handleStatusFilterChange,
    handleSearchChange,
    markAsRead: markAsReadMutation.mutate,
    markAsUnread: markAsUnreadMutation.mutate,
    markAllAsRead: (userId: string) => markAllAsReadMutation.mutate(userId),
    deleteNotification: deleteNotificationMutation.mutate,
    sendNotification: sendNotificationMutation.mutate,
    sendNotificationToRole: sendNotificationToRoleMutation.mutate,
    refetchNotifications: refetch,
    refreshNotifications,
  };
};
