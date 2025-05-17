
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useClientRealtime = (refreshCallback: () => Promise<void>) => {
  useEffect(() => {
    // Inscrever-se para atualizações em tempo real da tabela clients
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuta todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'clients',
        },
        () => {
          // Quando receber qualquer mudança, atualiza a lista de clientes
          refreshCallback();
        }
      )
      .subscribe();

    // Limpeza ao desmontar o componente
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshCallback]);
};
