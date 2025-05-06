import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionOptions {
  clientId?: string; // Optional client ID for filtering
  notifyOnUpdates?: boolean; // Whether to show notifications on updates
}

export const usePaymentRealtimeSubscription = (
  fetchPaymentRequests: () => Promise<void>,
  options: SubscriptionOptions = {}
) => {
  useEffect(() => {
    // Configure channel filter based on options
    let channelFilter: any = {};
    
    // If clientId is provided, filter payment requests for that client
    if (options.clientId) {
      channelFilter = {
        event: '*',
        schema: 'public',
        table: 'payment_requests',
        filter: `client_id=eq.${options.clientId}`
      };
    } else {
      // Otherwise, listen to all payment requests (admin view)
      channelFilter = {
        event: '*',
        schema: 'public',
        table: 'payment_requests'
      };
    }

    console.log('Setting up payment realtime subscription', options);
    
    // Setup real-time subscription
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', channelFilter, (payload) => {
        console.log('Payment request change received:', payload);
        // Reload the data
        fetchPaymentRequests();
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      console.log('Cleaning up payment realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [fetchPaymentRequests, options.clientId]);
};
