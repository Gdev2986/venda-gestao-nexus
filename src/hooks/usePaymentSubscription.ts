
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionCallback = () => void;

export const usePaymentSubscription = (callback: SubscriptionCallback) => {
  const { toast } = useToast();

  useEffect(() => {
    // Set up real-time subscription for new payment requests
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'payment_requests' }, 
        (payload) => {
          console.log('Change received!', payload);
          // In a real app, we would fetch updated data or update our state directly
          toast({
            title: 'Atualização de pagamento',
            description: 'Status do pagamento foi atualizado',
          });
          // Call the callback to reload data
          callback();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [callback, toast]);
};
