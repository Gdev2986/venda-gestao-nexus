
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentStatus } from "@/types/enums";

type SubscriptionCallback = () => void;

interface SubscriptionOptions {
  notifyUser?: boolean;
  filterByClientId?: string | null;
}

export const usePaymentSubscription = (callback: SubscriptionCallback, options?: SubscriptionOptions) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const notifyUser = options?.notifyUser !== false; // Default to true

  useEffect(() => {
    if (!user) return;
    
    console.log('Configurando inscrição para pagamentos:', options);

    // Configure filtros baseados em clientId
    let commonFilter: any = {
      schema: 'public',
      table: 'payment_requests'
    };
    
    // Se clientId for fornecido, filtre para esse cliente específico
    if (options?.filterByClientId) {
      commonFilter.filter = `client_id=eq.${options.filterByClientId}`;
    }
    
    // Canal para eventos INSERT
    const insertChannel = supabase
      .channel('payment_requests_inserts')
      .on('postgres_changes', {
        ...commonFilter,
        event: 'INSERT'
      }, (payload) => {
        console.log('Nova solicitação de pagamento criada:', payload);
        
        if (notifyUser) {
          toast({
            title: 'Nova Solicitação de Pagamento',
            description: 'Uma nova solicitação de pagamento foi criada',
          });
        }
        
        callback();
      })
      .subscribe();

    // Canal para eventos UPDATE
    const updateChannel = supabase
      .channel('payment_requests_updates')
      .on('postgres_changes', {
        ...commonFilter,
        event: 'UPDATE'
      }, (payload) => {
        console.log('Solicitação de pagamento atualizada:', payload);
        
        if (notifyUser) {
          const newStatus = payload.new?.status;
          let title = 'Atualização de Pagamento';
          let description = 'Uma solicitação de pagamento foi atualizada';
          let variant: 'default' | 'destructive' = 'default';
          
          if (newStatus === PaymentStatus.APPROVED) {
            title = 'Pagamento Aprovado';
            description = 'Uma solicitação de pagamento foi aprovada';
          } else if (newStatus === PaymentStatus.REJECTED) {
            title = 'Pagamento Rejeitado';
            description = 'Uma solicitação de pagamento foi rejeitada';
            variant = 'destructive';
          } else if (newStatus === PaymentStatus.PAID) {
            title = 'Pagamento Confirmado';
            description = 'O pagamento foi confirmado e finalizado';
          }
          
          toast({ 
            title, 
            description,
            variant 
          });
        }
        
        callback();
      })
      .subscribe();
      
    // Canal para eventos DELETE
    const deleteChannel = supabase
      .channel('payment_requests_deletes')
      .on('postgres_changes', {
        ...commonFilter,
        event: 'DELETE'
      }, (payload) => {
        console.log('Solicitação de pagamento excluída:', payload);
        
        if (notifyUser) {
          toast({
            title: 'Solicitação de Pagamento Removida',
            description: 'Uma solicitação de pagamento foi removida',
          });
        }
        
        callback();
      })
      .subscribe();
      
    return () => {
      console.log('Limpando inscrição para pagamentos');
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    };
  }, [callback, toast, notifyUser, options?.filterByClientId, user]);
};
