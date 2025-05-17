
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useClientRealtime(refreshCallback: () => void) {
  useEffect(() => {
    // Inscreva-se para alterações na tabela clients
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
