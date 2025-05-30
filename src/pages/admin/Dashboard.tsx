
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { DATE_FILTER_PRESETS, DateRangeFilters } from "@/components/dashboard/admin/DateRangeFilters";
import { QuickLinks } from "@/components/dashboard/admin/QuickLinks";
import { ChartsSection } from "@/components/dashboard/admin/ChartsSection";
import StatCards from "@/components/dashboard/admin/StatCards";
import { subDays } from "date-fns";
import PaymentMethodsBreakdown from "@/components/dashboard/admin/PaymentMethodsBreakdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useSalesContext } from "@/contexts/SalesContext";
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [pendingRequests, setPendingRequests] = useState(0);
  const { toast } = useToast();
  
  // Use the shared sales context
  const { 
    filteredSales, 
    isLoading, 
    refreshSales, 
    getMonthlyData, 
    getFilteredData,
    getChartsData,
    handleFilter,
    sales
  } = useSalesContext();

  // Get monthly data for main cards (always current month)
  const monthlyData = getMonthlyData();
  
  // Get filtered data for other stats
  const filteredData = getFilteredData();
  
  // Get charts data
  const chartsData = getChartsData();

  // Fetch pending requests
  const fetchPendingRequests = async () => {
    try {
      const { data: pendingData } = await supabase
        .from('payment_requests')
        .select('id')
        .eq('status', 'PENDING');

      setPendingRequests(pendingData?.length || 0);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  // Filter sales based on date range when it changes
  useEffect(() => {
    if (!dateRange.from || !dateRange.to) return;
    
    const startDate = new Date(dateRange.from);
    const endDate = new Date(dateRange.to);
    
    const filtered = sales.filter(sale => {
      // Ensure transaction_date is always a string and properly formatted
      const dateStr = typeof sale.transaction_date === 'string' ? sale.transaction_date : sale.transaction_date.toLocaleDateString('pt-BR');
      const datePart = dateStr.split(' ')[0]; // Get date part (DD/MM/YYYY)
      const saleDate = new Date(datePart.split('/').reverse().join('-')); // Convert to YYYY-MM-DD
      return saleDate >= startDate && saleDate <= endDate;
    });
    
    handleFilter(filtered);
  }, [dateRange, sales, handleFilter]);

  const handleRefresh = () => {
    refreshSales();
    fetchPendingRequests();
  };

  // Stats for the bottom section (filtered by date range)
  const filteredStats = {
    totalSales: filteredData.totalSales,
    grossSales: filteredData.grossSales,
    netSales: filteredData.netSales,
    pendingRequests: pendingRequests,
    totalCommissions: filteredData.totalCommissions,
    salesGrowth: filteredData.salesGrowth,
    isGrowthPositive: filteredData.isGrowthPositive
  };

  // Mock data for charts that don't have real data yet
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

  // Convert payment methods for charts
  const paymentMethods = chartsData.paymentMethodsDetail.map(item => ({
    name: item.method,
    value: item.amount,
    color: item.method === 'Cartão de Crédito' ? '#3b82f6' :
           item.method === 'Cartão de Débito' ? '#22c55e' : '#f59e0b',
    percent: Math.round(item.percentage)
  }));

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação e principais métricas"
      />

      {/* Key Metrics Section - Always shows current month data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Card - Current Month Only */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardDescription>Faturamento Total (Mês Atual)</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center">
              {isLoading ? (
                <div className="h-9 w-40 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {formatCurrency(monthlyData.grossSales)}
                  <span className="text-sm text-green-500 ml-2 flex items-center">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Atual
                  </span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Acumulado no mês corrente
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Card - Current Month Only */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription>Comissão Escritório (Mês Atual)</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center">
              {isLoading ? (
                <div className="h-9 w-40 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {formatCurrency(monthlyData.totalCommissions)}
                  <span className="text-sm text-green-500 ml-2 flex items-center">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    1.5%
                  </span>
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              1.5% do faturamento bruto
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Filters */}
      <Card className="p-4">
        <DateRangeFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </Card>

      <div className="space-y-4 md:space-y-6">
        {/* Stats Cards - These change based on the date filter */}
        <StatCards stats={filteredStats} isLoading={isLoading} />
        
        {/* Quick Links */}
        <div className="mt-4">
          <QuickLinks />
        </div>
        
        {/* Payment Methods Breakdown */}
        <div className="grid grid-cols-1 gap-4">
          <PaymentMethodsBreakdown 
            data={chartsData.paymentMethodsDetail} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Charts Grid */}
        <ChartsSection 
          salesData={chartsData.dailySales}
          paymentMethodsData={paymentMethods}
          topPartnersData={topPartners}
          clientGrowthData={clientGrowth}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
