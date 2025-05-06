
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PaymentStatus } from "@/types";

type SubscriptionCallback = () => void;

export const usePaymentSubscription = (callback: SubscriptionCallback, options?: { 
  notifyUser?: boolean;
  filterByClientId?: string;
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const notifyUser = options?.notifyUser !== false; // Default to true

  useEffect(() => {
    if (!user) return;
    
    console.log('Setting up payment subscription', options);

    // Set up four channels for different events: INSERT, UPDATE, DELETE, and * (all)
    // This helps ensure we don't miss any events due to channel conflicts
    
    // Channel for INSERT events
    const insertChannel = supabase
      .channel('payment_requests_inserts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'payment_requests',
        ...(options?.filterByClientId ? { filter: `client_id=eq.${options.filterByClientId}` } : {})
      }, (payload) => {
        console.log('New payment request created:', payload);
        
        if (notifyUser) {
          toast({
            title: 'Nova Solicitação de Pagamento',
            description: 'Uma nova solicitação de pagamento foi criada',
          });
        }
        
        callback();
      })
      .subscribe();

    // Channel for UPDATE events
    const updateChannel = supabase
      .channel('payment_requests_updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'payment_requests',
        ...(options?.filterByClientId ? { filter: `client_id=eq.${options.filterByClientId}` } : {})
      }, (payload) => {
        console.log('Payment request updated:', payload);
        
        if (notifyUser) {
          const newStatus = payload.new?.status;
          let title = 'Atualização de Pagamento';
          let description = 'Uma solicitação de pagamento foi atualizada';
          
          if (newStatus === PaymentStatus.APPROVED) {
            title = 'Pagamento Aprovado';
            description = 'Uma solicitação de pagamento foi aprovada';
          } else if (newStatus === PaymentStatus.REJECTED) {
            title = 'Pagamento Rejeitado';
            description = 'Uma solicitação de pagamento foi rejeitada';
          }
          
          toast({ title, description });
        }
        
        callback();
      })
      .subscribe();
      
    // Channel for DELETE events
    const deleteChannel = supabase
      .channel('payment_requests_deletes')
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'payment_requests',
        ...(options?.filterByClientId ? { filter: `client_id=eq.${options.filterByClientId}` } : {})
      }, (payload) => {
        console.log('Payment request deleted:', payload);
        
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
      console.log('Cleaning up payment subscription');
      supabase.removeChannel(insertChannel);
      supabase.removeChannel(updateChannel);
      supabase.removeChannel(deleteChannel);
    };
  }, [callback, toast, notifyUser, options?.filterByClientId, user]);
};
