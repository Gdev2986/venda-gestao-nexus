
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, CreditCard, ShoppingCart, Users, FileText } from 'lucide-react';

export const RealtimeToastNotifications = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    console.log('Setting up realtime toast notifications');

    // Sales notifications
    const salesChannel = supabase
      .channel('sales_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'sales'
      }, (payload) => {
        console.log('New sale detected:', payload);
        toast({
          title: "Nova Venda Registrada",
          description: `Venda de ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(payload.new.gross_amount)} registrada`,
          action: (
            <div className="flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span>Ver detalhes</span>
            </div>
          ),
        });
      })
      .subscribe();

    // Payment notifications
    const paymentsChannel = supabase
      .channel('payments_notifications')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'payment_requests'
      }, (payload) => {
        console.log('Payment status changed:', payload);
        const newStatus = payload.new.status;
        let statusText = '';
        
        switch (newStatus) {
          case 'APPROVED':
            statusText = 'Aprovado';
            break;
          case 'REJECTED':
            statusText = 'Rejeitado';
            break;
          case 'PAID':
            statusText = 'Pago';
            break;
          default:
            statusText = newStatus;
        }
        
        toast({
          title: "Status de Pagamento Alterado",
          description: `Pagamento alterado para: ${statusText}`,
          action: (
            <div className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              <span>Ver detalhes</span>
            </div>
          ),
        });
      })
      .subscribe();

    // Client notifications
    const clientsChannel = supabase
      .channel('clients_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'clients'
      }, (payload) => {
        console.log('New client created:', payload);
        toast({
          title: "Novo Cliente Cadastrado",
          description: `Cliente ${payload.new.business_name} foi adicionado`,
          action: (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              <span>Ver detalhes</span>
            </div>
          ),
        });
      })
      .subscribe();

    // Machine notifications
    const machinesChannel = supabase
      .channel('machines_notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'machines'
      }, (payload) => {
        console.log('Machine change detected:', payload);
        if (payload.eventType === 'INSERT') {
          toast({
            title: "Nova Máquina Cadastrada",
            description: `Máquina ${payload.new.serial_number} adicionada`,
            action: (
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>Ver detalhes</span>
              </div>
            ),
          });
        } else if (payload.eventType === 'UPDATE') {
          toast({
            title: "Máquina Atualizada",
            description: `Status da máquina ${payload.new.serial_number} alterado`,
            action: (
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span>Ver detalhes</span>
              </div>
            ),
          });
        }
      })
      .subscribe();

    return () => {
      console.log('Cleaning up realtime toast notifications');
      supabase.removeChannel(salesChannel);
      supabase.removeChannel(paymentsChannel);
      supabase.removeChannel(clientsChannel);
      supabase.removeChannel(machinesChannel);
    };
  }, [user, toast]);

  return null;
};
