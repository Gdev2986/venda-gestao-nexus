
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentRealtimeSubscription = (
  fetchPaymentRequests: () => Promise<void>
) => {
  useEffect(() => {
    // Setup real-time subscription
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'payment_requests' 
      }, () => {
        fetchPaymentRequests();
      })
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPaymentRequests]);
};
