
import React, { createContext, useContext, useState, useEffect } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/types/notification.types";

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading: boolean;
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

interface NotificationsProviderProps {
  children: React.ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Function to format notification timestamps
  const formatNotificationDate = (timestamp: string): string => {
    try {
      return format(new Date(timestamp), "dd/MM/yyyy HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return timestamp;
    }
  };

  const fetchNotifications = async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
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
        throw error;
      }

      if (data) {
        // Transform data to ensure it matches the Notification interface
        const transformedData: Notification[] = data.map((item: any) => ({
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          message: item.message,
          type: item.type,
          data: item.data,
          is_read: item.is_read || false,
          created_at: item.created_at,
        }));

        setNotifications(transformedData);
        setUnreadCount(transformedData.filter((n) => !n.is_read).length);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching notifications",
        description: error.message,
        variant: "destructive",
      });
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notification-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          // Handle different events
          if (payload.eventType === "INSERT") {
            const newNotification = payload.new as Notification;
            
            // Add to notifications list
            setNotifications((prev) => [newNotification, ...prev]);
            
            // Update unread count
            if (!newNotification.is_read) {
              setUnreadCount((prev) => prev + 1);
            }
            
            // Show toast for new notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          } else if (payload.eventType === "UPDATE") {
            const updatedNotification = payload.new as Notification;
            
            // Update notification in list
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === updatedNotification.id ? updatedNotification : n
              )
            );
            
            // Update unread count
            setUnreadCount((prev) => {
              return prev + (updatedNotification.is_read ? -1 : 1);
            });
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old.id;
            
            // Remove from notifications list
            setNotifications((prev) => prev.filter((n) => n.id !== deletedId));
            
            // Update unread count if needed
            if (!payload.old.is_read) {
              setUnreadCount((prev) => prev - 1);
            }
          }
          
          // Re-fetch to ensure consistency
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    if (!user) return;

    try {
      // First update local state for immediate UI feedback
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount((prev) => {
        const notification = notifications.find((n) => n.id === id);
        return notification && !notification.is_read ? prev - 1 : prev;
      });

      // Then update in database
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
      
      // Revert optimistic update
      fetchNotifications();
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user || notifications.length === 0) return;

    try {
      // First update local state for immediate UI feedback
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);

      // Then update in database
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .is("is_read", false);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
      
      // Revert optimistic update
      fetchNotifications();
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isLoading,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
