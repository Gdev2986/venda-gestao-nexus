
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionCallback = () => void;

export const usePaymentSubscription = (callback: SubscriptionCallback, options?: { 
  notifyUser?: boolean;
  filterByClientId?: string;
}) => {
  const { toast } = useToast();
  const notifyUser = options?.notifyUser !== false; // Por padrão, notifica o usuário

  useEffect(() => {
    // Configurar filtro por client_id se fornecido
    let filter = {};
    
    if (options?.filterByClientId) {
      filter = {
        schema: 'public',
        table: 'payment_requests',
        filter: `client_id=eq.${options.filterByClientId}`
      };
    } else {
      filter = {
        schema: 'public',
        table: 'payment_requests'
      };
    }

    // Configurar inscrição em tempo real para solicitações de pagamento
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', 
        { event: '*', ...filter }, 
        (payload) => {
          console.log('Alteração de pagamento recebida!', payload);
          
          // Notificar o usuário se a opção estiver ativada
          if (notifyUser) {
            let title = 'Atualização de pagamento';
            let description = 'Uma solicitação de pagamento foi atualizada';
            
            // Personalizar mensagem com base no tipo de evento
            if (payload.eventType === 'INSERT') {
              title = 'Nova solicitação de pagamento';
              description = 'Uma nova solicitação de pagamento foi recebida';
            } else if (payload.eventType === 'UPDATE') {
              const newStatus = payload.new?.status;
              if (newStatus === 'APPROVED') {
                title = 'Pagamento aprovado';
                description = 'Uma solicitação de pagamento foi aprovada';
              } else if (newStatus === 'REJECTED') {
                title = 'Pagamento rejeitado';
                description = 'Uma solicitação de pagamento foi rejeitada';
              }
            }
            
            toast({
              title,
              description,
            });
          }
          
          // Chamar o callback para recarregar os dados
          callback();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [callback, toast, notifyUser, options?.filterByClientId]);
};
