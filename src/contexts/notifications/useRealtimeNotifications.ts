
import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Notification } from "./types";
import { playNotificationSoundIfEnabled } from "@/services/notificationSoundService";
import { NotificationType } from "@/types";
import { getUserRole } from "./notificationsService";

export const useRealtimeNotifications = (
  userId: string | undefined,
  soundEnabled: boolean,
  onNewNotification: (notification: Notification) => void,
  onNotificationChange: () => void
) => {
  const setupSubscription = useCallback(async () => {
    if (!userId) return null;
    
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
            playNotificationSoundIfEnabled(
              newNotification.type as NotificationType, 
              soundEnabled
            );
            
            // Show toast notification
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
            
            // Update our notifications state through callback
            onNewNotification(newNotification);
          } else {
            // For updates or deletions, just refresh the list
            onNotificationChange();
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return channel;
  }, [userId, soundEnabled, onNewNotification, onNotificationChange]);

  useEffect(() => {
    const channelPromise = setupSubscription();
    
    return () => {
      console.log('Cleaning up notification subscription');
      channelPromise.then(ch => {
        if (ch) supabase.removeChannel(ch);
      });
    };
  }, [setupSubscription]);
};
