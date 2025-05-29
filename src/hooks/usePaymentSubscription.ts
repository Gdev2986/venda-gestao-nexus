
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface UsePaymentSubscriptionProps {
  notifyUser?: boolean;
  filterByClientId?: string;
}

export function usePaymentSubscription(
  loadPaymentRequests: () => Promise<void>,
  { notifyUser = false, filterByClientId }: UsePaymentSubscriptionProps = {}
) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      console.log("User not authenticated, skipping payment subscription.");
      return;
    }

    console.log("Setting up payment subscription with filters:", { notifyUser, filterByClientId });

    const channel = supabase
      .channel('payment_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_requests',
          filter: filterByClientId ? `client_id=eq.${filterByClientId}` : undefined,
        },
        (payload) => {
          console.log('Change received!', payload);
          loadPaymentRequests();

          if (notifyUser) {
            let notificationMessage = '';
            switch (payload.eventType) {
              case 'INSERT':
                notificationMessage = 'A new payment request has been created.';
                break;
              case 'UPDATE':
                notificationMessage = 'A payment request has been updated.';
                break;
              case 'DELETE':
                notificationMessage = 'A payment request has been deleted.';
                break;
              default:
                notificationMessage = 'A payment request has been changed.';
                break;
            }

            toast({
              title: 'Payment Request Update',
              description: notificationMessage,
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log("Unsubscribing from payment requests channel");
      supabase.removeChannel(channel);
    };
  }, [loadPaymentRequests, notifyUser, user, filterByClientId, toast]);
}
