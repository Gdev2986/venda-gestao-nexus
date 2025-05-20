import { supabase } from "@/integrations/supabase/client";
import { Notification, NotificationType } from "@/types/notification.types";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { UserRole } from "@/types";

/**
 * Fetches notifications for a specific user
 */
export const fetchUserNotifications = async (userId: string, userRole?: string | null) => {
  try {
    // Fetch notifications specifically for this user
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // Filter notifications based on recipient roles if specified
    let filteredData = data || [];
    
    if (userRole) {
      filteredData = filteredData.filter((notification: any) => {
        // If recipient_roles is null or empty array, show to everyone
        if (!notification.recipient_roles || notification.recipient_roles.length === 0) {
          return true;
        }
        // Otherwise, check if user's role is in recipient_roles
        return notification.recipient_roles.includes(userRole);
      });
    }

    // Fix the type casting to ensure compatibility
    return filteredData.map((item: any) => ({
      ...item,
      type: item.type as NotificationType,
      recipient_roles: item.recipient_roles || []
    })) as Notification[];
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

/**
 * Marks a notification as read
 */
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

/**
 * Marks all notifications for a user as read
 */
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

/**
 * Deletes a notification
 */
export const deleteUserNotification = async (notificationId: string) => {
  try {
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

/**
 * Sets up realtime subscription for notifications
 */
export const subscribeToNotifications = (userId: string, userRole: string | null | undefined, onNotification: (notification: Notification) => void, soundEnabled: boolean) => {
  console.log('Setting up realtime notifications for user role:', userRole);
  
  const channel = supabase
    .channel('public:notifications')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
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
            // Play sound based on notification type and sound preference
            playNotificationSoundIfEnabled(newNotification.type, soundEnabled);
            
            // Call the callback with the new notification
            onNotification(newNotification);
          }
        }
      }
    )
    .subscribe((status) => {
      console.log('Realtime subscription status:', status);
    });

  return channel;
};
