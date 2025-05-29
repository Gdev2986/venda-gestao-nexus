
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UsePaymentSubscriptionOptions {
  notifyUser?: boolean;
  filterByClientId?: string;
}

export function usePaymentSubscription(
  onDataChange: () => void,
  options: UsePaymentSubscriptionOptions = {}
) {
  useEffect(() => {
    const channel = supabase
      .channel('payment-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payment_requests',
          ...(options.filterByClientId && {
            filter: `client_id=eq.${options.filterByClientId}`
          })
        },
        (payload) => {
          console.log('Payment request change detected:', payload);
          
          if (options.notifyUser) {
            if (payload.eventType === 'INSERT') {
              toast({
                title: "Nova solicitação criada",
                description: "Sua solicitação de pagamento foi enviada com sucesso!"
              });
            } else if (payload.eventType === 'UPDATE') {
              const newRecord = payload.new as any;
              if (newRecord.status === 'APPROVED') {
                toast({
                  title: "Pagamento aprovado",
                  description: "Sua solicitação de pagamento foi aprovada!"
                });
              } else if (newRecord.status === 'REJECTED') {
                toast({
                  title: "Pagamento rejeitado",
                  description: "Sua solicitação de pagamento foi rejeitada."
                });
              }
            }
          }
          
          onDataChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange, options.notifyUser, options.filterByClientId]);
}
