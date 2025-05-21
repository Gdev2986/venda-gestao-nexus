
import { useEffect } from "react";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { Notification, NotificationType } from "@/types/notification.types";

export const useNotificationsSubscription = (
  userId: string | undefined,
  soundEnabled: boolean,
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>,
  fetchNotifications: () => Promise<void>
) => {
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
    if (userId) {
      fetchNotifications();

      // Set up realtime subscription for new notifications
      const setupRealtimeSubscription = async () => {
        const userRole = await getUserRole(userId);
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
                
                // Play sound based on notification type
                playNotificationSoundIfEnabled(newNotification.type as NotificationType, soundEnabled);
                
                // Show toast notification
                toast({
                  title: newNotification.title,
                  description: newNotification.message,
                });
                
                // Update our notifications state
                setNotifications(prev => [newNotification, ...prev]);
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
  }, [userId, soundEnabled, fetchNotifications, setNotifications]);
};
