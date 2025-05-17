
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Notification, NotificationType } from '@/types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  sendNotification: (userId: string, title: string, message: string, type: NotificationType, data?: any) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      if (data) {
        const formattedNotifications = data.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type as NotificationType,
          read: item.is_read,
          timestamp: new Date(item.created_at),
          data: item.data
        }));
        
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notificações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const subscribeToNotifications = () => {
    if (!user) return;
    
    console.log('Setting up notifications subscription for user:', user.id);
    
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('New notification received:', payload);
        
        // Mostrar toast para notificação recebida
        toast({
          title: payload.new.title || "Nova notificação",
          description: payload.new.message || "Você recebeu uma nova notificação"
        });
        
        // Atualizar a lista de notificações
        const newNotification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type as NotificationType,
          read: payload.new.is_read,
          timestamp: new Date(payload.new.created_at),
          data: payload.new.data
        };
        
        setNotifications(prev => [newNotification, ...prev]);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Notification updated:', payload);
        
        // Atualizar a notificação na lista
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === payload.new.id
              ? {
                  ...notification,
                  title: payload.new.title,
                  message: payload.new.message,
                  read: payload.new.is_read,
                  data: payload.new.data
                }
              : notification
          )
        );
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        console.log('Notification deleted:', payload);
        
        // Remover a notificação da lista
        setNotifications(prev =>
          prev.filter(notification => notification.id !== payload.old.id)
        );
      })
      .subscribe();
      
    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  };
  
  // Carregar notificações iniciais e configurar a assinatura
  useEffect(() => {
    if (user) {
      fetchNotifications();
      const unsubscribe = subscribeToNotifications();
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [user]);
  
  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Marcar uma notificação como lida
  const markAsRead = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(notification =>
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
  
  // Marcar uma notificação como não lida
  const markAsUnread = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: false })
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(notification =>
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
  
  // Marcar todas as notificações como lidas
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      
      if (error) throw error;
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
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
  
  // Excluir uma notificação
  const deleteNotification = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== id)
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
  
  // Enviar uma nova notificação
  const sendNotification = async (userId: string, title: string, message: string, type: NotificationType, data?: any) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            user_id: userId,
            title,
            message,
            type,
            data,
            is_read: false
          }
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso",
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive",
      });
    }
  };
  
  // Atualizar notificações
  const refreshNotifications = async () => {
    await fetchNotifications();
  };
  
  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    sendNotification,
    refreshNotifications
  };
  
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  
  return context;
};
