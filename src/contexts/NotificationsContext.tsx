import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Update the notification type to support read/unread status and timestamp
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  created_at: string;
  is_read: boolean; // Using is_read instead of read
  user_id: string;
}

// Update the context type to include missing methods
export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean; // Add loading
  markAsRead: (notificationId: string) => Promise<void>;
  markAsUnread: (notificationId: string) => Promise<void>; // Add markAsUnread
  deleteNotification: (notificationId: string) => Promise<void>; // Add deleteNotification
  refreshNotifications: () => Promise<void>; // Add refreshNotifications
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export const NotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      setNotifications(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao carregar notificações: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchNotifications();

    // Setup a real-time subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user?.id}` },
        (payload) => {
          console.log('Change received!', payload)
          fetchNotifications();
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchNotifications]);

  const insertNotification = async (
    user_id: string,
    title: string,
    message: string,
    type: string,
    data?: any
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert({
          user_id: user_id,
          title: title,
          message: message,
          type: type as any, // Cast to any to fix the type error
          data: data,
        });

      if (insertError) {
        throw new Error(`Failed to insert notification: ${insertError.message}`);
      }

      fetchNotifications();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao inserir notificação: ${error.message}`,
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        throw new Error(`Failed to mark as read: ${error.message}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Falha ao marcar como lida: ${error.message}`,
      });
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: false })
        .eq("id", notificationId);

      if (error) {
        throw new Error(`Failed to mark as unread: ${error.message}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: false } : notification
        )
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Failed to mark as unread: ${error.message}`,
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", notificationId);

      if (error) {
        throw new Error(`Failed to delete notification: ${error.message}`);
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Failed to delete notification: ${error.message}`,
      });
    }
  };

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  // Add the missing methods to the context value
  const contextValue: NotificationsContextType = {
    notifications,
    unreadCount,
    loading: isLoading,
    markAsRead,
    markAsUnread, // Add this function
    deleteNotification, // Add this function
    refreshNotifications: fetchNotifications, // Add this function
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
};
