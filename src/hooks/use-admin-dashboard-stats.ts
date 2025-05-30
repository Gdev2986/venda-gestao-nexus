
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethod } from '@/types';

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

export interface DashboardChartsData {
  dailySales: Array<{ name: string; gross: number; net: number }>;
  paymentMethods: Array<{ name: string; value: number; color: string; percent: number }>;
  paymentMethodsDetail: Array<{
    method: PaymentMethod;
    count: number;
    amount: number;
    percentage: number;
    installments?: Array<{
      installments: string;
      count: number;
      amount: number;
      percentage: number;
    }>;
  }>;
  topPartners: Array<{ name: string; value: number; commission: number }>;
  clientGrowth: Array<{ name: string; clients: number }>;
}

interface DateRange {
  from: Date;
  to?: Date;
}

export const useAdminDashboardStats = (dateRange?: DateRange) => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [chartsData, setChartsData] = useState<DashboardChartsData | null>(null);
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

      // Calcular estatísticas básicas
      const totalSales = salesData?.length || 0;
      const grossSales = salesData?.reduce((sum, sale) => sum + Number(sale.gross_amount), 0) || 0;
      const netSales = salesData?.reduce((sum, sale) => sum + Number(sale.net_amount), 0) || 0;
      const totalCommissions = grossSales * 0.015; // 1.5% do bruto

      // Buscar solicitações pendentes
      const { data: pendingData } = await supabase
        .from('payment_requests')
        .select('id')
        .eq('status', 'PENDING');

      const pendingRequests = pendingData?.length || 0;

      // Calcular crescimento
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

      // Preparar dados para gráficos
      await fetchChartsData(salesData || []);

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

  const fetchChartsData = async (salesData: any[]) => {
    try {
      // Vendas diárias
      const dailySalesMap = new Map();
      salesData.forEach(sale => {
        const date = new Date(sale.date).toLocaleDateString('pt-BR', { 
          day: '2-digit', 
          month: '2-digit' 
        });
        if (!dailySalesMap.has(date)) {
          dailySalesMap.set(date, { gross: 0, net: 0 });
        }
        const current = dailySalesMap.get(date);
        current.gross += Number(sale.gross_amount);
        current.net += Number(sale.net_amount);
      });

      const dailySales = Array.from(dailySalesMap.entries())
        .map(([date, data]) => ({
          name: date,
          gross: data.gross,
          net: data.net
        }))
        .sort((a, b) => a.name.localeCompare(b.name))
        .slice(-7); // Últimos 7 dias

      // Métodos de pagamento
      const paymentMethodsMap = new Map();
      const paymentMethodColors = {
        [PaymentMethod.CREDIT]: '#3b82f6',
        [PaymentMethod.DEBIT]: '#22c55e',
        [PaymentMethod.PIX]: '#f59e0b'
      };

      salesData.forEach(sale => {
        const method = sale.payment_method;
        if (!paymentMethodsMap.has(method)) {
          paymentMethodsMap.set(method, { count: 0, amount: 0, installments: new Map() });
        }
        const current = paymentMethodsMap.get(method);
        current.count += 1;
        current.amount += Number(sale.gross_amount);

        // Rastrear parcelamentos para crédito
        if (method === PaymentMethod.CREDIT) {
          const installments = sale.installments || 1;
          if (!current.installments.has(installments)) {
            current.installments.set(installments, { count: 0, amount: 0 });
          }
          const installmentData = current.installments.get(installments);
          installmentData.count += 1;
          installmentData.amount += Number(sale.gross_amount);
        }
      });

      const totalAmount = salesData.reduce((sum, sale) => sum + Number(sale.gross_amount), 0);

      const paymentMethods = Array.from(paymentMethodsMap.entries()).map(([method, data]) => {
        const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;
        const methodName = method === PaymentMethod.CREDIT ? 'Crédito' :
                          method === PaymentMethod.DEBIT ? 'Débito' : 'Pix';
        
        return {
          name: methodName,
          value: data.amount,
          color: paymentMethodColors[method as PaymentMethod] || '#64748b',
          percent: Math.round(percentage)
        };
      });

      const paymentMethodsDetail = Array.from(paymentMethodsMap.entries()).map(([method, data]) => {
        const percentage = totalAmount > 0 ? (data.amount / totalAmount) * 100 : 0;
        
        let installments = undefined;
        if (method === PaymentMethod.CREDIT && data.installments.size > 0) {
          const creditTotal = data.amount;
          installments = Array.from(data.installments.entries()).map(([inst, instData]) => ({
            installments: inst.toString(),
            count: instData.count,
            amount: instData.amount,
            percentage: creditTotal > 0 ? (instData.amount / creditTotal) * 100 : 0
          })).sort((a, b) => Number(a.installments) - Number(b.installments));
        }

        return {
          method: method as PaymentMethod,
          count: data.count,
          amount: data.amount,
          percentage: Math.round(percentage * 10) / 10,
          installments
        };
      });

      // Mock data for top partners and client growth (will need real data later)
      const topPartners = [
        { name: "Parceiro A", value: 15200, commission: 1520 },
        { name: "Parceiro B", value: 12800, commission: 1280 },
        { name: "Parceiro C", value: 9750, commission: 975 },
        { name: "Parceiro D", value: 7200, commission: 720 },
        { name: "Parceiro E", value: 5100, commission: 510 }
      ];

      const clientGrowth = [
        { name: "Jan", clients: 24 },
        { name: "Fev", clients: 28 },
        { name: "Mar", clients: 35 },
        { name: "Abr", clients: 42 },
        { name: "Mai", clients: 48 },
        { name: "Jun", clients: 53 }
      ];

      setChartsData({
        dailySales,
        paymentMethods,
        paymentMethodsDetail,
        topPartners,
        clientGrowth
      });

    } catch (error) {
      console.error('Erro ao processar dados dos gráficos:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange?.from, dateRange?.to]);

  return {
    stats,
    chartsData,
    isLoading,
    refreshStats: fetchStats
  };
};
