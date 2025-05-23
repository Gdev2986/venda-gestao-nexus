
import { useEffect, useRef } from "react";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { showNotificationToast } from "@/components/notifications/NotificationToast";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { Notification, NotificationType } from "@/types/notification.types";

export const useNotificationsSubscription = (
  userId: string | undefined,
  soundEnabled: boolean,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  fetchNotifications: () => Promise<void>
) => {
  // Use ref to track if the subscription has been set up
  const subscriptionSetupRef = useRef(false);
  
  // Get the user's role - without using profile property directly
  const getUserRole = async (userId: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching user role:", error);
        return null;
      }
      
      return data?.role || null;
    } catch (err) {
      console.error("Error in getUserRole:", err);
      return null;
    }
  };

  useEffect(() => {
    // If no userId or subscription already set up, do nothing
    if (!userId || subscriptionSetupRef.current) return;

    // Mark subscription as set up to prevent duplicate subscriptions
    subscriptionSetupRef.current = true;
    
    // Function to fetch notifications and set up subscription
    const initialize = async () => {
      // Fetch notifications first
      await fetchNotifications();
      
      // Then set up subscription
      const userRole = await getUserRole(userId);
      console.log('Setting up realtime notifications for user role:', userRole);
      
      // Subscribe to personal notifications
      const personalChannel = supabase
        .channel('personal-notifications')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            console.log('Personal notification change received!', payload);
            handleNotificationChange(payload);
          }
        )
        .subscribe((status) => {
          console.log('Personal realtime subscription status:', status);
        });
      
      // Subscribe to role-specific notifications if the user is an admin or logistics
      let roleChannel;
      if (userRole === 'ADMIN' || userRole === 'LOGISTICS') {
        roleChannel = supabase
          .channel('role-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `data->>'recipient_roles'?'${userRole}'`,
            },
            (payload) => {
              console.log('Role-based notification received!', payload);
              handleNotificationChange(payload);
            }
          )
          .subscribe((status) => {
            console.log('Role-based realtime subscription status:', status);
          });
      }

      // Return both channels for cleanup
      return { personalChannel, roleChannel };
    };

    // Function to handle notification changes
    const handleNotificationChange = (payload: any) => {
      if (payload.eventType === 'INSERT') {
        const newNotification = payload.new as Notification;
        
        // Play sound based on notification type
        playNotificationSoundIfEnabled(newNotification.type as NotificationType, soundEnabled);
        
        // Show toast AND browser notification
        showNotificationToast({
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type as NotificationType
        });
        
        // Update our notifications state
        setNotifications(prev => [newNotification, ...prev]);
      } else {
        // For updates or deletions, just refresh the list
        fetchNotifications();
      }
    };

    // Set up the subscription
    const setupPromise = initialize();
    
    // Cleanup function
    return () => {
      console.log('Cleaning up notification subscription');
      setupPromise.then(channels => {
        if (channels.personalChannel) supabase.removeChannel(channels.personalChannel);
        if (channels.roleChannel) supabase.removeChannel(channels.roleChannel);
        // Reset the ref when unmounting
        subscriptionSetupRef.current = false;
      });
    };
  }, [userId, soundEnabled, fetchNotifications, setNotifications]);
};
