
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseNotificationsParams {
  searchTerm?: string;
  typeFilter?: string;
  statusFilter?: string;
  page?: number;
  pageSize?: number;
}

export const useNotifications = (params: UseNotificationsParams = {}) => {
  const { searchTerm = "", typeFilter = "all", statusFilter = "all", page = 1, pageSize = 50 } = params;
  
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { toast } = useToast();
  
  // Subscribe to real-time updates
  useEffect(() => {
    // In a real implementation with Supabase, subscribe to real-time updates here
    // const channel = supabase.channel('public:notifications')
    // channel.on('INSERT', handleInsert).on('UPDATE', handleUpdate).subscribe()
    // return () => { supabase.removeChannel(channel) }
  }, []);
  
  useEffect(() => {
    fetchNotifications();
  }, [searchTerm, typeFilter, statusFilter, page]);
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would fetch from the Supabase table
      // let query = supabase.from('notifications').select('*').eq('user_id', userId)
      
      // For now, we'll mock the data
      setTimeout(() => {
        const mockNotifications = getMockNotifications();
        
        // Apply filters
        let filtered = mockNotifications;
        
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
        setIsLoading(false);
      }, 600);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notificações",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      // In a real implementation:
      // await supabase.from('notifications').update({ is_read: true }).eq('id', id)
      
      // For mocking
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
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
      // In a real implementation:
      // await supabase.from('notifications').update({ is_read: false }).eq('id', id)
      
      // For mocking
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
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
      // In a real implementation:
      // await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId)
      
      // For mocking
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, read: true }))
      );
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
      // In a real implementation:
      // await supabase.from('notifications').delete().eq('id', id)
      
      // For mocking
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
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
      // In a real implementation:
      // await supabase.from('notifications').delete().eq('user_id', userId)
      
      // For mocking
      setNotifications([]);
    } catch (error) {
      console.error("Error deleting all notifications:", error);
      toast({
        title: "Erro",
        description: "Falha ao excluir todas as notificações",
        variant: "destructive",
      });
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
    totalPages,
    refreshNotifications,
  };
};

// Mock data generator function
const getMockNotifications = () => {
  const now = new Date();
  return [
    {
      id: "1",
      title: "Nova venda registrada",
      message: "Uma nova venda foi processada no valor de R$ 150,00",
      type: "SALE",
      read: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      title: "Pagamento aprovado",
      message: "Seu pagamento no valor de R$ 500,00 foi aprovado",
      type: "PAYMENT_APPROVED",
      read: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      title: "Atualização de sistema",
      message: "O sistema foi atualizado com novas funcionalidades",
      type: "GENERAL",
      read: true,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 24), // 1 day ago
    },
    {
      id: "4",
      title: "Máquina em manutenção",
      message: "A máquina #SN-234567 entrou em manutenção",
      type: "MACHINE",
      read: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 36), // 1.5 days ago
    },
    {
      id: "5",
      title: "Novo chamado de suporte",
      message: "Um novo chamado de suporte foi aberto para você",
      type: "SUPPORT",
      read: true,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 48), // 2 days ago
    },
    {
      id: "6",
      title: "Promoção disponível",
      message: "Nova promoção para seus clientes disponível",
      type: "GENERAL",
      read: false,
      timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 72), // 3 days ago
    },
  ];
};
