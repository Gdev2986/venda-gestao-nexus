
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NotificationType, Notification } from "@/types/notification.types";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  sendNotificationToRoles: (title: string, message: string, type: NotificationType, roles: string[], data?: any) => Promise<void>;
  sendNotificationToUser: (userId: string, title: string, message: string, type: NotificationType, data?: any) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("notification-sound-enabled");
      return saved !== "false";
    } catch {
      return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Save sound preference
  useEffect(() => {
    try {
      localStorage.setItem("notification-sound-enabled", String(soundEnabled));
    } catch (error) {
      console.error("Failed to save sound preference:", error);
    }
  }, [soundEnabled]);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      const typedNotifications: Notification[] = (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        is_read: item.is_read,
        created_at: item.created_at,
        data: item.data || {},
      }));

      setNotifications(typedNotifications);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Erro",
        description: "Falha ao carregar notificações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Erro",
        description: "Falha ao marcar notificação como lida",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );

      toast({
        title: "Sucesso",
        description: "Todas as notificações foram marcadas como lidas"
      });
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Erro",
        description: "Falha ao marcar todas as notificações como lidas",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setNotifications(prev => prev.filter(n => n.id !== id));

      toast({
        title: "Sucesso",
        description: "Notificação removida"
      });
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Erro",
        description: "Falha ao remover notificação",
        variant: "destructive"
      });
    }
  };

  const sendNotificationToRoles = async (
    title: string, 
    message: string, 
    type: NotificationType, 
    roles: string[], 
    data: any = {}
  ) => {
    try {
      const { error } = await supabase.rpc('send_notification_to_roles', {
        notification_title: title,
        notification_message: message,
        notification_type: type,
        target_roles: roles,
        notification_data: data
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso"
      });
    } catch (error: any) {
      console.error("Error sending notification to roles:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive"
      });
    }
  };

  const sendNotificationToUser = async (
    userId: string,
    title: string, 
    message: string, 
    type: NotificationType, 
    data: any = {}
  ) => {
    try {
      const { error } = await supabase.rpc('send_notification_to_user', {
        target_user_id: userId,
        notification_title: title,
        notification_message: message,
        notification_type: type,
        notification_data: data
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Notificação enviada com sucesso"
      });
    } catch (error: any) {
      console.error("Error sending notification to user:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar notificação",
        variant: "destructive"
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;

    console.log('Setting up real-time notifications for user:', user.id);
    
    // Fetch initial notifications
    fetchNotifications();

    // Subscribe to new notifications for this user
    const channel = supabase
      .channel('notifications_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newNotification = payload.new as Notification;
            
            // Play sound
            playNotificationSoundIfEnabled(newNotification.type as NotificationType, soundEnabled);
            
            // Show toast
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
            
            // Add to notifications list
            setNotifications(prev => [newNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev => 
              prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setNotifications(prev => prev.filter(n => n.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        console.log('Real-time subscription status:', status);
      });

    // Cleanup subscription
    return () => {
      console.log('Cleaning up notifications subscription');
      supabase.removeChannel(channel);
    };
  }, [user?.id, soundEnabled]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      soundEnabled,
      setSoundEnabled,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      fetchNotifications,
      sendNotificationToRoles,
      sendNotificationToUser
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};
