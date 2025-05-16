import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Notification, NotificationType } from "@/types";

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  addMultipleNotifications: (notifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[]) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      console.log("User not authenticated, skipping notifications fetch");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar notificações",
          description:
            "Não foi possível carregar suas notificações. Tente novamente.",
        });
      }

      if (data) {
        const formattedNotifications: Notification[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type as NotificationType, // Type assertion here
          read: item.is_read,
          timestamp: new Date(item.created_at),
          data: item.data,
        }));
        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter((n) => !n.read).length);
      }
    } catch (error) {
      console.error("Unexpected error fetching notifications:", error);
      toast({
        variant: "destructive",
        title: "Erro Inesperado",
        description:
          "Ocorreu um erro ao carregar as notificações. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription to notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('custom-all-insert')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        payload => {
          console.log('Change received!', payload)
          const newNotification = payload.new as any;

          const formattedNotification: Notification = {
            id: newNotification.id,
            title: newNotification.title,
            message: newNotification.message,
            type: newNotification.type as NotificationType,
            read: newNotification.is_read,
            timestamp: new Date(newNotification.created_at),
            data: newNotification.data,
          };

          setNotifications((prevNotifications) => [formattedNotification, ...prevNotifications]);
          setUnreadCount(count => count + 1);
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", notificationId);

      if (error) {
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        variant: "destructive",
        title: "Erro ao marcar como lida",
        description: "Não foi possível marcar a notificação como lida.",
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        variant: "destructive",
        title: "Erro ao marcar todas como lidas",
        description: "Não foi possível marcar todas as notificações como lidas.",
      });
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          data: notification.data || {},
          is_read: false
        }]);

      if (error) {
        console.error("Error inserting notification:", error);
        toast({
          variant: "destructive",
          title: "Erro ao enviar notificação",
          description: "Não foi possível enviar a notificação."
        });
      } else {
        console.log("Notification sent successfully");
      }
    } catch (error) {
      console.error("Unexpected error sending notification:", error);
      toast({
        variant: "destructive",
        title: "Erro Inesperado",
        description: "Ocorreu um erro ao enviar a notificação."
      });
    }
  };

  const addMultipleNotifications = async (notifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[]) => {
    if (!user) return;

    // Insert notifications one by one to handle the type issue
    let hasError = false;
    for (const notification of notifications) {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: notification.title,
          message: notification.message,
          // Cast the type to string to match database expectations
          type: notification.type.toString(),
          data: notification.data || {},
          is_read: false
        });
        
      if (error) {
        console.error("Error inserting notification:", error);
        hasError = true;
      }
    }

    if (hasError) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificações",
        description: "Algumas notificações não puderam ser enviadas."
      });
    } else {
      console.log("All notifications sent successfully");
    }
  };

  const value: NotificationsContextProps = {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    addMultipleNotifications,
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
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};
