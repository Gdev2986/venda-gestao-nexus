
import { useState, useEffect, memo } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { DATE_FILTER_PRESETS, DateRangeFilters } from "@/components/dashboard/admin/DateRangeFilters";
import { QuickLinks } from "@/components/dashboard/admin/QuickLinks";
import { ChartsSection } from "@/components/dashboard/admin/ChartsSection";
import StatCards from "@/components/dashboard/admin/StatCards";
import { subDays } from "date-fns";
import PaymentMethodsBreakdown from "@/components/dashboard/admin/PaymentMethodsBreakdown";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useAdminDashboardStats } from "@/hooks/use-admin-dashboard-stats";

const AdminDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const { toast } = useToast();
  
  // Use our real stats hook
  const { stats, chartsData, isLoading, refreshStats } = useAdminDashboardStats(dateRange);

  // Default stats with the expected shape
  const defaultStats = {
    totalSales: 0,
    grossSales: 0,
    netSales: 0,
    pendingRequests: 0,
    totalCommissions: 0,
    salesGrowth: 0,
    isGrowthPositive: false
  };

  // Default charts data
  const defaultChartsData = {
    dailySales: [],
    paymentMethods: [],
    paymentMethodsDetail: [],
    topPartners: [],
    clientGrowth: []
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação e principais métricas"
      />

      {/* Key Metrics Section - Always visible with current data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue Card */}
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardDescription>Faturamento Total</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center">
              {isLoading ? (
                <div className="h-9 w-40 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {formatCurrency(stats?.grossSales || 0)}
                  {stats?.isGrowthPositive && (
                    <span className="text-sm text-green-500 ml-2 flex items-center">
                      <ArrowUp className="h-4 w-4 inline mr-1" />
                      {stats?.salesGrowth}%
                    </span>
                  )}
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Acumulado no período
            </div>
          </CardContent>
        </Card>
        
        {/* Commission Card */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardDescription>Comissão Escritório</CardDescription>
            <CardTitle className="text-3xl font-bold flex items-center">
              {isLoading ? (
                <div className="h-9 w-40 bg-muted animate-pulse rounded" />
              ) : (
                <>
                  {formatCurrency(stats?.totalCommissions || 0)}
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
              Total de comissões geradas
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
          onRefresh={refreshStats}
        />
      </Card>

      <div className="space-y-4 md:space-y-6">
        {/* Stats Cards - These change based on the date filter */}
        <StatCards stats={stats || defaultStats} isLoading={isLoading} />
        
        {/* Quick Links */}
        <div className="mt-4">
          <QuickLinks />
        </div>
        
        {/* Payment Methods Breakdown */}
        <div className="grid grid-cols-1 gap-4">
          <PaymentMethodsBreakdown 
            data={chartsData?.paymentMethodsDetail || []} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Charts Grid */}
        <ChartsSection 
          salesData={chartsData?.dailySales || defaultChartsData.dailySales}
          paymentMethodsData={chartsData?.paymentMethods || defaultChartsData.paymentMethods}
          topPartnersData={chartsData?.topPartners || defaultChartsData.topPartners}
          clientGrowthData={chartsData?.clientGrowth || defaultChartsData.clientGrowth}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
