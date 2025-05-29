
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
  sendNotificationToRoles: (title: string, message: string, type: NotificationType, roles: string[], data?: any) => Promise<number>;
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

// Available roles with labels
const AVAILABLE_ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "CLIENT", label: "Cliente" },
  { value: "PARTNER", label: "Parceiro" },
  { value: "FINANCIAL", label: "Financeiro" },
  { value: "LOGISTICS", label: "Logística" },
] as const;

type ValidRole = typeof AVAILABLE_ROLES[number]["value"];

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
        data: (item.data && typeof item.data === 'object') ? item.data as Record<string, any> : {},
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

  // Enhanced function with fallback and better error handling
  const sendNotificationToRoles = async (
    title: string, 
    message: string, 
    type: NotificationType, 
    roles: string[], 
    data: any = {}
  ): Promise<number> => {
    console.log('Sending notification to roles:', { title, message, type, roles, data });
    
    // Validate and filter roles
    const validRoles = roles.filter(role => 
      AVAILABLE_ROLES.some(availableRole => availableRole.value === role)
    ) as ValidRole[];
    
    if (validRoles.length === 0) {
      throw new Error("Nenhuma função válida fornecida");
    }

    try {
      // Try using the database function first
      const { data: result, error } = await supabase
        .rpc('send_notification_to_roles', {
          notification_title: title,
          notification_message: message,
          notification_type: type,
          target_roles: validRoles,
          notification_data: data
        });

      if (error) {
        console.error('Database function error:', error);
        // Fallback to direct insertion
        return await sendNotificationToRolesFallback(title, message, type, validRoles, data);
      }

      const insertedCount = result || 0;
      console.log(`Notification sent successfully to ${insertedCount} users in roles:`, validRoles);
      
      return insertedCount;
    } catch (error: any) {
      console.error("Error sending notification to roles:", error);
      // Try fallback method
      return await sendNotificationToRolesFallback(title, message, type, validRoles, data);
    }
  };

  // Fallback method using direct database queries
  const sendNotificationToRolesFallback = async (
    title: string,
    message: string,
    type: NotificationType,
    roles: ValidRole[],
    data: any = {}
  ): Promise<number> => {
    console.log('Using fallback method for notification sending');
    
    try {
      // Get all users with the specified roles
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id')
        .in('role', roles)
        .eq('status', 'active');

      if (usersError) throw usersError;

      if (!users || users.length === 0) {
        console.warn('No active users found for roles:', roles);
        return 0;
      }

      // Create notifications for all users - fix type casting
      const notifications = users.map(user => ({
        user_id: user.id,
        title,
        message,
        type: type as any, // Cast to match Supabase type expectations
        data: data || {}
      }));

      const { data: insertedNotifications, error: insertError } = await supabase
        .from('notifications')
        .insert(notifications)
        .select();

      if (insertError) throw insertError;

      const insertedCount = insertedNotifications?.length || 0;
      console.log(`Fallback method: sent ${insertedCount} notifications to roles:`, roles);
      
      return insertedCount;
    } catch (error: any) {
      console.error("Fallback method failed:", error);
      throw new Error("Falha ao enviar notificação mesmo com método alternativo");
    }
  };

  const sendNotificationToUser = async (
    userId: string,
    title: string, 
    message: string, 
    type: NotificationType, 
    data: any = {}
  ) => {
    console.log('Sending notification to user:', { userId, title, message, type, data });
    
    try {
      // Try using the database function first
      const { data: result, error } = await supabase
        .rpc('send_notification_to_user', {
          target_user_id: userId,
          notification_title: title,
          notification_message: message,
          notification_type: type,
          notification_data: data
        });

      if (error) {
        console.error('Database function error:', error);
        // Fallback to direct insertion
        await sendNotificationToUserFallback(userId, title, message, type, data);
        return;
      }

      console.log('Notification sent successfully to user:', userId);
    } catch (error: any) {
      console.error("Error sending notification to user:", error);
      // Try fallback method
      await sendNotificationToUserFallback(userId, title, message, type, data);
    }
  };

  // Fallback method for single user notification
  const sendNotificationToUserFallback = async (
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    data: any = {}
  ) => {
    console.log('Using fallback method for user notification');
    
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type: type as any, // Cast to match Supabase type expectations
        data: data || {}
      });

    if (error) {
      console.error("Fallback method failed for user notification:", error);
      throw new Error("Falha ao enviar notificação para o usuário");
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
            const newNotification = payload.new as any;
            const typedNotification: Notification = {
              id: newNotification.id,
              user_id: newNotification.user_id,
              title: newNotification.title,
              message: newNotification.message,
              type: newNotification.type as NotificationType,
              is_read: newNotification.is_read,
              created_at: newNotification.created_at,
              data: (newNotification.data && typeof newNotification.data === 'object') 
                ? newNotification.data as Record<string, any> 
                : {},
            };
            
            // Play sound
            playNotificationSoundIfEnabled(typedNotification.type, soundEnabled);
            
            // Show toast
            toast({
              title: typedNotification.title,
              description: typedNotification.message,
            });
            
            // Add to notifications list
            setNotifications(prev => [typedNotification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedNotification = payload.new as any;
            const typedNotification: Notification = {
              id: updatedNotification.id,
              user_id: updatedNotification.user_id,
              title: updatedNotification.title,
              message: updatedNotification.message,
              type: updatedNotification.type as NotificationType,
              is_read: updatedNotification.is_read,
              created_at: updatedNotification.created_at,
              data: (updatedNotification.data && typeof updatedNotification.data === 'object') 
                ? updatedNotification.data as Record<string, any> 
                : {},
            };
            
            setNotifications(prev => 
              prev.map(n => n.id === typedNotification.id ? typedNotification : n)
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
