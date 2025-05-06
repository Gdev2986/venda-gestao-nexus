
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MachineStats {
  activeMachines: number;
  machinesInMaintenance: number;
  paperRequests: number;
  pendingServices: number;
}

export const useMachineStats = (dateRange: { from: Date; to?: Date }) => {
  const [stats, setStats] = useState<MachineStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch data from Supabase
        // For now, we'll mock the data
        setTimeout(() => {
          setStats({
            activeMachines: 68,
            machinesInMaintenance: 12,
            paperRequests: 24,
            pendingServices: 36
          });
          setIsLoading(false);
        }, 600);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível obter os dados estatísticos."
        });
        setIsLoading(false);
      }
    };

    fetchStats();

    // Set up realtime subscription for future implementations
    const channel = supabase
      .channel('machine-stats')
      .on('broadcast', { event: 'stats-update' }, (payload) => {
        console.log('Received stats update:', payload);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dateRange, toast]);

  const refreshStats = () => {
    setIsLoading(true);
    // Simulate refresh with a timeout
    setTimeout(() => {
      setStats(prevStats => ({ 
        activeMachines: prevStats?.activeMachines || 68,
        machinesInMaintenance: prevStats?.machinesInMaintenance || 12,
        paperRequests: prevStats?.paperRequests || 24,
        pendingServices: prevStats?.pendingServices || 36
      }));
      setIsLoading(false);
    }, 600);
  };

  return { stats, isLoading, refreshStats };
};
