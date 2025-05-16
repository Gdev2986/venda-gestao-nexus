
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PaymentStatus } from "@/types/enums";

interface PaymentNotificationsProps {
  refreshPayments: () => void;
  clientId?: string;
}

export const PaymentNotifications = ({ refreshPayments, clientId }: PaymentNotificationsProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('Configurando notificações em tempo real para pagamentos');
    
    // Configure filtros baseados em clientId
    let channelFilter: any = {
      event: '*',
      schema: 'public',
      table: 'payment_requests'
    };
    
    // Se clientId for fornecido, filtre para esse cliente específico
    if (clientId) {
      channelFilter.filter = `client_id=eq.${clientId}`;
    }
    
    // Configurar inscrição em tempo real
    const channel = supabase
      .channel('payment_requests_changes')
      .on('postgres_changes', channelFilter, (payload) => {
        console.log('Mudança em pagamento detectada:', payload);
        
        // Dependendo do tipo de evento e status, mostre notificação diferente
        if (payload.eventType === 'INSERT') {
          toast({
            title: "Nova Solicitação",
            description: "Uma nova solicitação de pagamento foi criada",
          });
        } 
        else if (payload.eventType === 'UPDATE') {
          const newStatus = payload.new?.status;
          
          if (newStatus === PaymentStatus.APPROVED) {
            toast({
              title: "Pagamento Aprovado",
              description: "Uma solicitação de pagamento foi aprovada",
              variant: "default"
            });
          } 
          else if (newStatus === PaymentStatus.REJECTED) {
            toast({
              title: "Pagamento Rejeitado",
              description: "Uma solicitação de pagamento foi rejeitada",
              variant: "destructive"
            });
          }
          else if (newStatus === PaymentStatus.PAID) {
            toast({
              title: "Pagamento Confirmado",
              description: "O pagamento foi confirmado e finalizado",
              variant: "default"
            });
          }
        }
        
        // Recarregar dados após qualquer alteração
        refreshPayments();
      })
      .subscribe();
      
    // Limpar inscrição quando componente for desmontado
    return () => {
      console.log('Limpando notificações em tempo real para pagamentos');
      supabase.removeChannel(channel);
    };
  }, [refreshPayments, toast, clientId]);
  
  // Este componente não renderiza nada visualmente
  return null;
};
