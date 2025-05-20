
import * as React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './types';

export const useRealtimeNotifications = (
  callback: (notification: Notification) => void
) => {
  const callbackRef = React.useRef(callback);

  // Update the callback ref when the callback changes
  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up realtime subscription
  React.useEffect(() => {
    console.log('Setting up realtime notifications subscription');
    
    // Create channel name based on table and event type
    const channelName = `realtime:notifications:INSERT`;
    
    // Set up the subscription
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('New notification received:', payload);
          // Call the callback with the notification data
          if (payload.new && typeof payload.new === 'object') {
            callbackRef.current(payload.new as Notification);
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up realtime notifications subscription');
      supabase.removeChannel(channel);
    };
  }, []);
};
