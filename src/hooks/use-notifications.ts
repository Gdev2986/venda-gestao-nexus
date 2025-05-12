
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification, NotificationType, UserRole } from "@/types";

interface NotificationHook {
  notifications: Notification[];
  isLoading: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  fetchNotifications: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: (userId: string) => Promise<void>;
  createNotification: (
    title: string, 
    message: string, 
    type: NotificationType,
    data?: Record<string, any>
  ) => Promise<void>;
  sendNotificationToRole: (
    title: string, 
    message: string, 
    type: NotificationType, 
    role: UserRole, 
    data?: Record<string, any>
  ) => Promise<void>;
}

export const useNotifications = (): NotificationHook => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        return;
      }

      // Convert from database format to app format
      const formattedNotifications: Notification[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as NotificationType,
        read: item.is_read,
        created_at: item.created_at,
        user_id: item.user_id,
        data: item.data
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Exception fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);

      if (error) {
        console.error("Error marking notification as read:", error);
        return;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error("Exception marking notification as read:", error);
    }
  };

  const markAsUnread = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: false })
        .eq("id", id);

      if (error) {
        console.error("Error marking notification as unread:", error);
        return;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === id ? { ...notification, read: false } : notification
        )
      );
    } catch (error) {
      console.error("Exception marking notification as unread:", error);
    }
  };

  const markAllAsRead = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userId);

      if (error) {
        console.error("Error marking all notifications as read:", error);
        return;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Exception marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting notification:", error);
        return;
      }

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== id)
      );
    } catch (error) {
      console.error("Exception deleting notification:", error);
    }
  };

  const deleteAllNotifications = async (userId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting all notifications:", error);
        return;
      }

      // Update local state
      setNotifications([]);
    } catch (error) {
      console.error("Exception deleting all notifications:", error);
    }
  };

  const createNotification = async (
    title: string,
    message: string,
    type: NotificationType,
    data?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      const notification = {
        title,
        message,
        type,
        user_id: user.id,
        is_read: false,
        data: data || {}
      };

      const { data: insertedData, error } = await supabase
        .from("notifications")
        .insert(notification)
        .select();

      if (error) {
        console.error("Error creating notification:", error);
        return;
      }

      // Update local state if needed
      if (insertedData && insertedData.length > 0) {
        const newNotification: Notification = {
          id: insertedData[0].id,
          title: insertedData[0].title,
          message: insertedData[0].message,
          type: insertedData[0].type as NotificationType,
          read: false,
          created_at: insertedData[0].created_at,
          user_id: insertedData[0].user_id,
          data: insertedData[0].data
        };
        setNotifications((prev) => [newNotification, ...prev]);
      }
    } catch (error) {
      console.error("Exception creating notification:", error);
    }
  };

  const sendNotificationToRole = async (
    title: string,
    message: string,
    type: NotificationType,
    role: UserRole,
    data?: Record<string, any>
  ) => {
    try {
      // Primeiro, busque todos os usuários com a função específica
      const { data: users, error: usersError } = await supabase
        .from("profiles")
        .select("id")
        .eq("role", role);

      if (usersError) {
        console.error("Error fetching users by role:", usersError);
        return;
      }

      if (!users || users.length === 0) {
        console.log(`No users found with role: ${role}`);
        return;
      }

      // Crie notificações para cada usuário encontrado
      const notificationsToInsert = users.map(user => ({
        title,
        message,
        type,
        user_id: user.id,
        is_read: false,
        data: data || {},
        role: role
      }));

      // Insira todas as notificações de uma só vez
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notificationsToInsert);

      if (insertError) {
        console.error("Error creating bulk notifications:", insertError);
        return;
      }

      console.log(`${notificationsToInsert.length} notifications sent to users with role ${role}`);
    } catch (error) {
      console.error("Exception sending notifications to role:", error);
    }
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    fetchNotifications,
    deleteNotification,
    deleteAllNotifications,
    createNotification,
    sendNotificationToRole
  };
};
