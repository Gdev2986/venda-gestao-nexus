
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to subscribe to realtime updates on the clients table
 * @param refreshCallback Function to call when an update is received
 */
export function useClientRealtime(refreshCallback: () => void) {
  useEffect(() => {
    // Subscribe to changes in the clients table
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'clients' },
        () => {
          refreshCallback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshCallback]);
}
