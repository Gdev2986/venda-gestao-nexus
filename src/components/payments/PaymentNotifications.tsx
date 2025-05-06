
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PaymentNotificationsProps {
  refreshPayments: () => void;
}

export const PaymentNotifications = ({ refreshPayments }: PaymentNotificationsProps) => {
  const { toast } = useToast();

  // Listen for notifications from the database
  useEffect(() => {
    const notificationsChannel = supabase
      .channel('notifications_admin')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: "type=eq.PAYMENT_REQUEST"
        },
        (payload) => {
          console.log('New notification received:', payload);
          
          toast({
            title: payload.new.title || "Nova solicitação de pagamento",
            description: payload.new.message || "Um cliente enviou uma nova solicitação de pagamento"
          });
          
          // Refresh payment requests
          refreshPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
    };
  }, [toast, refreshPayments]);

  // This is a utility component with no UI
  return null;
};
