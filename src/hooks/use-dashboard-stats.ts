
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface DashboardStats {
  totalSales: number;
  grossSales: number;
  netSales: number;
  pendingRequests: number;
  expenses: number;
  totalCommissions: number;
  currentBalance: number;
  salesGrowth: number;
  isGrowthPositive: boolean;
  totalClients: number;
  totalMachines: number;
}

export const useDashboardStats = (dateRange: { from: Date; to?: Date }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would fetch data from Supabase
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // For now, we'll just mock the data
        // In a real implementation, we would fetch this from Supabase
        
        setTimeout(() => {
          setStats({
            totalSales: 125750.50,
            grossSales: 98230.75,
            netSales: 88450.10,
            pendingRequests: 42,
            expenses: 15320.45,
            totalCommissions: 9780.65,
            currentBalance: 52480.90,
            salesGrowth: 12.5,
            isGrowthPositive: true,
            totalClients: 48,
            totalMachines: 76
          });
          setIsLoading(false);
        }, 800);
        
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar estatísticas",
          description: "Não foi possível obter os dados do dashboard."
        });
        setIsLoading(false);
      }
    };

    fetchStats();

    // Set up realtime subscription for future implementations
    const channel = supabase
      .channel('dashboard-stats')
      .on('broadcast', { event: 'stats-update' }, (payload) => {
        // In a real implementation, we would update the stats based on the payload
        console.log('Received stats update:', payload);
        // fetchStats(); // Refetch data when notified of updates
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
      // Just reassign the same stats for the mock
      setStats(prevStats => ({ ...prevStats! }));
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados do dashboard foram atualizados com sucesso."
      });
    }, 800);
  };

  return { stats, isLoading, refreshStats };
};
