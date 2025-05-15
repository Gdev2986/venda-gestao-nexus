
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from "@/components/ui/popover";
import { 
  ChartPie,
  BarChart,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { format, subDays, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { pt } from "date-fns/locale";
import StatCards from "@/components/dashboard/admin/StatCards";
import SalesChart from "@/components/dashboard/admin/SalesChart";
import PaymentMethodsChart from "@/components/dashboard/admin/PaymentMethodsChart";
import TopPartnersChart from "@/components/dashboard/admin/TopPartnersChart";
import ClientGrowthChart from "@/components/dashboard/admin/ClientGrowthChart";
import { useToast } from "@/hooks/use-toast";

// Dashboard date filter presets
const DATE_FILTER_PRESETS = {
  LAST_7_DAYS: "last_7_days",
  LAST_30_DAYS: "last_30_days",
  CURRENT_MONTH: "current_month",
  QUARTER: "quarter",
  CUSTOM: "custom"
};

// Dashboard mock data
const MOCK_DATA = {
  stats: {
    totalSales: 125750.50,
    grossSales: 98230.75,
    netSales: 88450.10,
    pendingRequests: 42,
    expenses: 15320.45,
    totalCommissions: 9780.65,
    currentBalance: 52480.90,
    salesGrowth: 12.5,
    isGrowthPositive: true
  },
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

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const { toast } = useToast();
  
  // Function to simulate data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados do dashboard foram atualizados com sucesso."
      });
    }, 1500);
  };

  // Function to handle filter changes
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    const now = new Date();
    switch(filter) {
      case DATE_FILTER_PRESETS.LAST_7_DAYS:
        setDateRange({
          from: subDays(now, 7),
          to: now
        });
        break;
      case DATE_FILTER_PRESETS.LAST_30_DAYS:
        setDateRange({
          from: subDays(now, 30),
          to: now
        });
        break;
      case DATE_FILTER_PRESETS.CURRENT_MONTH:
        setDateRange({
          from: startOfMonth(now),
          to: endOfMonth(now)
        });
        break;
      case DATE_FILTER_PRESETS.QUARTER:
        setDateRange({
          from: startOfQuarter(now),
          to: endOfQuarter(now)
        });
        break;
      // Custom remains unchanged as it's set directly by the calendar
    }
  };

  // Function to generate quick links
  const renderQuickLinks = () => {
    const links = [
      { name: "Vendas", icon: BarChart, path: "/admin/sales", color: "bg-blue-100 dark:bg-blue-900" },
      { name: "Pagamentos", icon: TrendingUp, path: "/admin/payments", color: "bg-green-100 dark:bg-green-900" },
      { name: "Relatórios", icon: ChartPie, path: "/admin/reports", color: "bg-yellow-100 dark:bg-yellow-900" },
      { name: "Parceiros", icon: Users, path: "/admin/partners", color: "bg-purple-100 dark:bg-purple-900" }
    ];

    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {links.map((link) => (
          <Card key={link.name} className="hover:shadow-md transition-shadow">
            <Button 
              variant="ghost" 
              className="h-full w-full flex flex-col items-center justify-center py-4 md:py-6"
              onClick={() => {
                toast({
                  title: `Navegando para ${link.name}`,
                  description: `Redirecionando para a área de ${link.name.toLowerCase()}.`
                });
                // In a real app, this would use router navigation
                window.location.href = link.path;
              }}
            >
              <div className={cn("rounded-full p-2 md:p-3 mb-2", link.color)}>
                <link.icon className="h-4 w-4 md:h-5 md:w-5" />
              </div>
              <span className="text-sm md:text-base">{link.name}</span>
              <ArrowRight size={14} className="mt-1 opacity-50" />
            </Button>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação e principais métricas"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3 sm:mt-0">
          {/* Date filter - scrollable on mobile */}
          <div className="flex flex-nowrap overflow-x-auto w-full pb-1 sm:pb-0 sm:w-auto gap-0 shadow-sm rounded-md">
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.LAST_7_DAYS ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_7_DAYS)}
              className="rounded-r-none flex-shrink-0"
              size="sm"
            >
              7 dias
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.LAST_30_DAYS ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_30_DAYS)}
              className="rounded-none border-l-0 border-r-0 flex-shrink-0"
              size="sm"
            >
              30 dias
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.CURRENT_MONTH ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.CURRENT_MONTH)}
              className="rounded-none border-r-0 flex-shrink-0"
              size="sm"
            >
              Mês
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.QUARTER ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.QUARTER)}
              className="rounded-l-none flex-shrink-0"
              size="sm"
            >
              Trimestre
            </Button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto mt-3 sm:mt-0">
            {/* Calendar picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                  <CalendarIcon size={16} />
                  <span className="truncate text-xs sm:text-sm">
                    {dateRange.from && dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yy")} - {format(dateRange.to, "dd/MM/yy")}
                      </>
                    ) : (
                      "Período"
                    )}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={pt}
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange(range);
                      setActiveFilter(DATE_FILTER_PRESETS.CUSTOM);
                    }
                  }}
                  numberOfMonths={1}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isLoading}
              size="icon"
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-4 md:space-y-6">
        {/* Stats Cards */}
        <StatCards stats={MOCK_DATA.stats} isLoading={isLoading} />
        
        {/* Quick Links */}
        <div className="mt-4 md:mt-6">
          <h3 className="text-base md:text-lg font-medium mb-3 md:mb-4">Atalhos Rápidos</h3>
          {renderQuickLinks()}
        </div>
        
        {/* Charts Grid - Stack vertically on mobile */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Sales Chart */}
          <SalesChart data={MOCK_DATA.dailySales} isLoading={isLoading} />
          
          {/* Payment Methods Chart */}
          <PaymentMethodsChart data={MOCK_DATA.paymentMethods} isLoading={isLoading} />
          
          {/* Partners and Growth Charts - Stack on mobile, side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Top Partners Chart */}
            <TopPartnersChart data={MOCK_DATA.topPartners} isLoading={isLoading} />
            
            {/* Client Growth Chart */}
            <ClientGrowthChart data={MOCK_DATA.clientGrowth} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
