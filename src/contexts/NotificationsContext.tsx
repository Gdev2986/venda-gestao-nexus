import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { NotificationType, Notification } from "@/types/notification.types";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { UserRole } from "@/types";

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  isLoading?: boolean;
  deleteNotification?: (notificationId: string) => Promise<void>;
  refreshNotifications?: () => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(
  undefined
);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  // Load sound preference from localStorage on initial load
  useEffect(() => {
    const savedSoundPreference = localStorage.getItem("notification_sound_enabled");
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === "true");
    }
  }, []);

  // Save sound preference to localStorage when changed
  useEffect(() => {
    localStorage.setItem("notification_sound_enabled", soundEnabled.toString());
  }, [soundEnabled]);

  // Get the user's role directly from the profile object
  const userRole = profile?.role;

  useEffect(() => {
    if (user) {
      fetchNotifications();

      // Set up realtime subscription for new notifications
      const setupRealtimeSubscription = async () => {
        console.log('Setting up realtime notifications for user role:', userRole);
        
        const channel = supabase
          .channel('public:notifications')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              console.log('Notification change received!', payload);
              
              if (payload.eventType === 'INSERT') {
                const newNotification = payload.new as Notification;
                
                // Check if this notification is intended for the user's role
                const isForUserRole = !newNotification.recipient_roles || 
                  newNotification.recipient_roles.length === 0 || 
                  (userRole && newNotification.recipient_roles.includes(userRole));
                
                if (isForUserRole) {
                  // Play sound based on notification type
                  playNotificationSoundIfEnabled(newNotification.type as NotificationType, soundEnabled);
                  
                  // Show toast notification
                  toast({
                    title: newNotification.title,
                    description: newNotification.message,
                  });
                  
                  // Update our notifications state
                  setNotifications(prev => [newNotification, ...prev]);
                }
              } else {
                // For updates or deletions, just refresh the list
                fetchNotifications();
              }
            }
          )
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
          });

        return channel;
      };

      const channel = setupRealtimeSubscription();
      
      return () => {
        console.log('Cleaning up notification subscription');
        channel.then(ch => {
          if (ch) supabase.removeChannel(ch);
        });
      };
    }
  }, [user, soundEnabled, userRole, toast]);

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.filter((notification) => !notification.is_read).length;
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // Fetch notifications specifically for this user
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      // Filter notifications based on recipient roles if specified
      let filteredData = data || [];
      
      if (userRole) {
        filteredData = filteredData.filter((notification) => {
          // If recipient_roles is null or empty array, show to everyone
          if (!notification.recipient_roles || notification.recipient_roles.length === 0) {
            return true;
          }
          // Otherwise, check if user's role is in recipient_roles
          return notification.recipient_roles.includes(userRole);
        });
      }

      // Fix the type casting to ensure compatibility
      setNotifications(filteredData.map(item => ({
        ...item,
        type: item.type as NotificationType
      })));
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error fetching notifications",
        description: error.message || "Failed to load notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to mark notification as read. Try again.",
        variant: "destructive",
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
        prevNotifications.map((notification) => ({ ...notification, is_read: true }))
      );
    } catch (error: any) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description:
          error.message ||
          "Failed to mark all notifications as read. Please try again.",
        variant: "destructive",
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
        throw error;
      }

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification.",
        variant: "destructive",
      });
    }
  };

  const refreshNotifications = async () => {
    await fetchNotifications();
  };

  const value: NotificationsContextProps = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    isLoading,
    deleteNotification,
    refreshNotifications,
    soundEnabled,
    setSoundEnabled
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
