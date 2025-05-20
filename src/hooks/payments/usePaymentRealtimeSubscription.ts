
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionOptions {
  clientId?: string; // Optional client ID for filtering
  notifyOnUpdates?: boolean; // Whether to show notifications on updates
}

export const usePaymentRealtimeSubscription = (
  fetchPaymentRequests: () => Promise<void>,
  options: SubscriptionOptions = {}
) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Configure channel filter based on options and user role
    let channelFilter: any = {
      event: '*',
      schema: 'public',
      table: 'payment_requests',
    };
    
    // If clientId is provided, filter payment requests for that client
    if (options.clientId) {
      channelFilter.filter = `client_id=eq.${options.clientId}`;
    } else if (userRole === 'CLIENT') {
      // For clients, only listen to their own payment requests
      // We'll fetch the client_id first
      const fetchClientId = async () => {
        const { data } = await supabase
          .from('user_client_access')
          .select('client_id')
          .eq('user_id', user.id)
          .single();
          
        if (data) {
          // Re-setup the subscription with the client_id filter
          setupSubscription(data.client_id);
        }
      };
      
      fetchClientId();
      return;
    }
    
    // Setup the subscription
    function setupSubscription(clientIdFilter?: string) {
      if (clientIdFilter) {
        channelFilter.filter = `client_id=eq.${clientIdFilter}`;
      }
      
      console.log('Setting up payment realtime subscription with filter:', channelFilter);
      
      // Setup real-time subscription
      const channel = supabase
        .channel('payment_requests_changes')
        .on('postgres_changes', channelFilter, (payload) => {
          console.log('Payment request change received:', payload);
          
          // Show notification if enabled
          if (options.notifyOnUpdates) {
            const eventType = payload.eventType;
            const newRecord = payload.new || {};
            const oldRecord = payload.old || {};
            
            if (eventType === 'INSERT') {
              const amount = typeof newRecord === 'object' && 'amount' in newRecord ? newRecord.amount : 'N/A';
              toast({
                title: 'Novo pagamento',
                description: `Um novo pagamento de R$${amount} foi criado`,
              });
            } else if (eventType === 'UPDATE' && 
                      typeof oldRecord === 'object' && typeof newRecord === 'object' && 
                      'status' in oldRecord && 'status' in newRecord &&
                      oldRecord.status !== newRecord.status) {
              const statusMessages: {[key: string]: string} = {
                'PENDING': 'aguardando aprovação',
                'APPROVED': 'aprovado',
                'REJECTED': 'rejeitado',
                'PAID': 'pago'
              };
              
              const newStatus = typeof newRecord === 'object' && 'status' in newRecord ? 
                statusMessages[newRecord.status as string] || newRecord.status as string : 'desconhecido';
              
              toast({
                title: 'Status do pagamento alterado',
                description: `Pagamento agora está ${newStatus}`,
              });
            } else if (eventType === 'DELETE') {
              toast({
                title: 'Pagamento removido',
                description: 'Um pagamento foi excluído do sistema',
              });
            }
          }
          
          // Reload the data
          fetchPaymentRequests();
        })
        .subscribe();

      // Cleanup subscription on component unmount
      return () => {
        console.log('Cleaning up payment realtime subscription');
        supabase.removeChannel(channel);
      };
    }
    
    return setupSubscription();
  }, [fetchPaymentRequests, options, user, userRole, toast]);
};
