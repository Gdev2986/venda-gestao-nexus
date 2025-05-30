
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminDashboardStats {
  totalSales: number;
  grossSales: number;
  netSales: number;
  pendingRequests: number;
  totalCommissions: number;
  currentBalance?: number;
  salesGrowth: number;
  isGrowthPositive: boolean;
}

interface DateRange {
  from: Date;
  to?: Date;
}

export const useAdminDashboardStats = (dateRange?: DateRange) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setIsLoading(true);

      // Build date filter
      let query = supabase
        .from('sales')
        .select('*');

      if (dateRange?.from) {
        query = query.gte('date', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        query = query.lte('date', dateRange.to.toISOString());
      }

      const { data: salesData, error: salesError } = await query;

      if (salesError) {
        throw salesError;
      }

      // Calcular estatísticas
      const totalSales = salesData?.length || 0;
      const grossSales = salesData?.reduce((sum, sale) => sum + Number(sale.gross_amount), 0) || 0;
      
      // Líquido = Bruto - Taxa Final (assumindo 3% como taxa final padrão por enquanto)
      const netSales = salesData?.reduce((sum, sale) => sum + Number(sale.net_amount), 0) || 0;
      
      // Comissão = diferença entre Raiz e Repasse x o Bruto (assumindo 1.5% como diferença padrão)
      const totalCommissions = grossSales * 0.015; // 1.5% do bruto

      // Buscar solicitações pendentes
      const { data: pendingData } = await supabase
        .from('payment_requests')
        .select('id')
        .eq('status', 'PENDING');

      const pendingRequests = pendingData?.length || 0;

      // Calcular crescimento (comparando com período anterior)
      let salesGrowth = 0;
      let isGrowthPositive = false;

      if (dateRange?.from && dateRange?.to) {
        const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
        const previousStartDate = new Date(dateRange.from);
        previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
        
        const { data: previousSalesData } = await supabase
          .from('sales')
          .select('gross_amount')
          .gte('date', previousStartDate.toISOString())
          .lt('date', dateRange.from.toISOString());

        const previousGross = previousSalesData?.reduce((sum, sale) => sum + Number(sale.gross_amount), 0) || 0;
        
        if (previousGross > 0) {
          salesGrowth = Number(((grossSales - previousGross) / previousGross * 100).toFixed(1));
          isGrowthPositive = salesGrowth > 0;
        }
      }

      setStats({
        totalSales,
        grossSales,
        netSales,
        pendingRequests,
        totalCommissions,
        salesGrowth,
        isGrowthPositive
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

  useEffect(() => {
    fetchStats();
  }, [dateRange?.from, dateRange?.to]);

  return {
    stats,
    isLoading,
    refreshStats: fetchStats
  };
};
