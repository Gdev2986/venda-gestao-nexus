
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ClientSubscriptionCallback = () => void;

export const useClientRealtime = (callback: ClientSubscriptionCallback) => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    console.log('Configurando inscrição para clientes em tempo real');

    // Configurar o canal para atualizações em tempo real
    const clientsTable = supabase
      .channel('clients_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'clients',
      }, (payload) => {
        console.log('Cliente atualizado:', payload);
        
        // Atualizar a lista de clientes
        callback();
      })
      .subscribe();

    // Configurar canal para notificações específicas
    const notificationsChannel = supabase
      .channel('client_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: 'type=eq.BALANCE_UPDATE'
      }, (payload) => {
        console.log('Nova notificação de saldo:', payload);
        
        // Exibir notificação para administradores sobre atualizações de saldo
        if (user.user_metadata?.role === 'ADMIN' || user.user_metadata?.role === 'FINANCIAL') {
          toast({
            title: "Saldo atualizado",
            description: "O saldo de um cliente foi atualizado com sucesso",
          });
        }
      })
      .subscribe();
    
    return () => {
      console.log('Limpando inscrição para clientes em tempo real');
      supabase.removeChannel(clientsTable);
      supabase.removeChannel(notificationsChannel);
    };
  }, [callback, toast, user]);
};
