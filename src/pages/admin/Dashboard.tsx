
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { DATE_FILTER_PRESETS, DateRangeFilters } from "@/components/dashboard/admin/DateRangeFilters";
import { QuickLinks } from "@/components/dashboard/admin/QuickLinks";
import { ChartsSection } from "@/components/dashboard/admin/ChartsSection";
import StatCards from "@/components/dashboard/admin/StatCards";
import { subDays } from "date-fns";
import PaymentMethodsBreakdown from "@/components/dashboard/admin/PaymentMethodsBreakdown";
import { PaymentMethod } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const AdminDashboard = () => {
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const { toast } = useToast();
  
  // Use our stats hook
  const { stats, isLoading, refreshStats } = useDashboardStats(dateRange);
  
  // Mock data for visualization components
  const MOCK_DATA = {
    dailySales: [
      { name: "01/05", gross: 12500, net: 9375 },
      { name: "02/05", gross: 9800, net: 7350 },
      { name: "03/05", gross: 15200, net: 11400 },
      { name: "04/05", gross: 18500, net: 13875 },
      { name: "05/05", gross: 22300, net: 16725 },
      { name: "06/05", gross: 19800, net: 14850 },
      { name: "07/05", gross: 14500, net: 10875 }
    ],
    paymentMethods: [
      { name: "Crédito", value: 68500, color: "#3b82f6", percent: 55 },
      { name: "Débito", value: 37500, color: "#22c55e", percent: 30 },
      { name: "Pix", value: 19750, color: "#f59e0b", percent: 15 }
    ],
    paymentMethodsDetail: [
      { 
        method: PaymentMethod.CREDIT, 
        count: 456, 
        amount: 68500, 
        percentage: 55,
        installments: [
          { installments: "1", count: 120, amount: 18500, percentage: 27 },
          { installments: "2", count: 95, amount: 15300, percentage: 22 },
          { installments: "3", count: 85, amount: 12800, percentage: 19 },
          { installments: "4", count: 65, amount: 9700, percentage: 14 },
          { installments: "5", count: 40, amount: 6200, percentage: 9 },
          { installments: "6", count: 35, amount: 4300, percentage: 6 },
          { installments: "12", count: 16, amount: 1700, percentage: 3 }
        ]
      },
      { method: PaymentMethod.DEBIT, count: 320, amount: 37500, percentage: 30 },
      { method: PaymentMethod.PIX, count: 215, amount: 19750, percentage: 15 }
    ],
    topPartners: [
      { name: "Parceiro A", value: 15200, commission: 1520 },
      { name: "Parceiro B", value: 12800, commission: 1280 },
      { name: "Parceiro C", value: 9750, commission: 975 },
      { name: "Parceiro D", value: 7200, commission: 720 },
      { name: "Parceiro E", value: 5100, commission: 510 }
    ],
    clientGrowth: [
      { name: "Jan", clients: 24 },
      { name: "Fev", clients: 28 },
      { name: "Mar", clients: 35 },
      { name: "Abr", clients: 42 },
      { name: "Mai", clients: 48 },
      { name: "Jun", clients: 53 }
    ]
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
                  {formatCurrency(stats?.totalSales || 0)}
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
        <StatCards stats={stats || MOCK_DATA.stats} isLoading={isLoading} />
        
        {/* Quick Links */}
        <div className="mt-4">
          <QuickLinks />
        </div>
        
        {/* Payment Methods Breakdown */}
        <div className="grid grid-cols-1 gap-4">
          <PaymentMethodsBreakdown 
            data={MOCK_DATA.paymentMethodsDetail} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Charts Grid */}
        <ChartsSection 
          salesData={MOCK_DATA.dailySales}
          paymentMethodsData={MOCK_DATA.paymentMethods}
          topPartnersData={MOCK_DATA.topPartnersData || MOCK_DATA.topPartners}
          clientGrowthData={MOCK_DATA.clientGrowth}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
