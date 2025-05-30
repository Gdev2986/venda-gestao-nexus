
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface LogisticsStats {
  totalMachines: number;
  onlineMachines: number;
  pendingRequests: number;
  completedDeliveries: number;
  totalShipments: number;
  inTransitShipments: number;
  pendingShipments: number;
  deliveredShipments: number;
}

export const useLogisticsStats = () => {
  const [stats, setStats] = useState<LogisticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Buscar estatísticas das máquinas
        const { data: machines, error: machinesError } = await supabase
          .from('machines')
          .select('status');

        if (machinesError) throw machinesError;

        // Buscar estatísticas de solicitações de suporte
        const { data: requests, error: requestsError } = await supabase
          .from('support_requests')
          .select('status');

        if (requestsError) throw requestsError;

        // Buscar estatísticas de envios
        const { data: shipments, error: shipmentsError } = await supabase
          .from('shipments')
          .select('status');

        if (shipmentsError) throw shipmentsError;

        const totalMachines = machines?.length || 0;
        const onlineMachines = machines?.filter(m => m.status === 'ACTIVE').length || 0;
        const pendingRequests = requests?.filter(r => r.status === 'PENDING').length || 0;
        
        const totalShipments = shipments?.length || 0;
        const inTransitShipments = shipments?.filter(s => s.status === 'in_transit').length || 0;
        const pendingShipments = shipments?.filter(s => s.status === 'pending').length || 0;
        const deliveredShipments = shipments?.filter(s => s.status === 'delivered').length || 0;

        setStats({
          totalMachines,
          onlineMachines,
          pendingRequests,
          completedDeliveries: deliveredShipments,
          totalShipments,
          inTransitShipments,
          pendingShipments,
          deliveredShipments
        });
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar estatísticas do dashboard",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Configurar atualização em tempo real
    const channel = supabase
      .channel('logistics-stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'machines' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_requests' }, fetchStats)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, fetchStats)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return { stats, isLoading };
};
