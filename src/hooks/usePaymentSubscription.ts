
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionCallback = () => void;

export const usePaymentSubscription = (callback: SubscriptionCallback, options?: { 
  notifyUser?: boolean;
  filterByClientId?: string;
}) => {
  const { toast } = useToast();
  const notifyUser = options?.notifyUser !== false; // Default to true

  useEffect(() => {
    // Configure filter by client_id if provided
    let channelFilter: any = {};
    
    if (options?.filterByClientId) {
      channelFilter = {
        event: '*',
        schema: 'public',
        table: 'payment_requests',
        filter: `client_id=eq.${options.filterByClientId}`
      };
    } else {
      channelFilter = {
        event: '*',
        schema: 'public',
        table: 'payment_requests'
      };
    }

    console.log('Setting up payment subscription', options);

    // Set up real-time subscription for payment requests
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', channelFilter, (payload) => {
        console.log('Payment change received!', payload);
        
        // Notify user if option is enabled
        if (notifyUser) {
          let title = 'Payment Update';
          let description = 'A payment request has been updated';
          
          // Customize message based on event type
          if (payload.eventType === 'INSERT') {
            title = 'New Payment Request';
            description = 'A new payment request has been received';
          } else if (payload.eventType === 'UPDATE') {
            const newStatus = payload.new?.status;
            if (newStatus === 'APPROVED') {
              title = 'Payment Approved';
              description = 'A payment request has been approved';
            } else if (newStatus === 'REJECTED') {
              title = 'Payment Rejected';
              description = 'A payment request has been rejected';
            }
          }
          
          toast({
            title,
            description,
          });
        }
        
        // Call the callback to reload data
        callback();
      })
      .subscribe();
      
    return () => {
      console.log('Cleaning up payment subscription');
      supabase.removeChannel(channel);
    };
  }, [callback, toast, notifyUser, options?.filterByClientId]);
};
