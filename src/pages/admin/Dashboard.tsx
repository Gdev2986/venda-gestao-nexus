
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {links.map((link) => (
          <Card key={link.name} className="hover:shadow-md transition-shadow">
            <Button 
              variant="ghost" 
              className="h-full w-full flex flex-col items-center justify-center py-2 md:py-6"
              onClick={() => {
                toast({
                  title: `Navegando para ${link.name}`,
                  description: `Redirecionando para a área de ${link.name.toLowerCase()}.`
                });
                // In a real app, this would use router navigation
                window.location.href = link.path;
              }}
            >
              <div className={cn("rounded-full p-2 md:p-3 mb-1 md:mb-2", link.color)}>
                <link.icon size={16} className="md:hidden" />
                <link.icon size={24} className="hidden md:block" />
              </div>
              <span className="text-xs md:text-base">{link.name}</span>
              <ArrowRight size={12} className="mt-1 md:mt-2 opacity-50 md:hidden" />
              <ArrowRight size={16} className="mt-2 opacity-50 hidden md:block" />
            </Button>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Dashboard Administrativo"
        description="Visão geral da operação e principais métricas"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2 sm:mt-0">
          {/* Date filter */}
          <div className="flex shadow-sm rounded-md w-full sm:w-auto overflow-x-auto">
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.LAST_7_DAYS ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_7_DAYS)}
              className="rounded-r-none px-2 md:px-3 h-7 md:h-9"
              size="sm"
            >
              <span className="text-xs">7 dias</span>
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.LAST_30_DAYS ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.LAST_30_DAYS)}
              className="rounded-none border-l-0 border-r-0 px-2 md:px-3 h-7 md:h-9"
              size="sm"
            >
              <span className="text-xs">30 dias</span>
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.CURRENT_MONTH ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.CURRENT_MONTH)}
              className="rounded-none border-r-0 px-2 md:px-3 h-7 md:h-9"
              size="sm"
            >
              <span className="text-xs">Mês</span>
            </Button>
            <Button 
              variant={activeFilter === DATE_FILTER_PRESETS.QUARTER ? "default" : "outline"}
              onClick={() => handleFilterChange(DATE_FILTER_PRESETS.QUARTER)}
              className="rounded-l-none px-2 md:px-3 h-7 md:h-9"
              size="sm"
            >
              <span className="text-xs">Trimestre</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            {/* Calendar picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 h-7 md:h-9 text-xs w-full sm:w-auto">
                  <CalendarIcon size={14} />
                  <span className="truncate text-xs">
                    {dateRange.from && dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM")} - {format(dateRange.to, "dd/MM")}
                      </>
                    ) : (
                      "Selec. período"
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
                  className={cn("p-2 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              onClick={handleRefresh} 
              disabled={isLoading}
              size="sm"
              className="flex items-center p-0 h-7 md:h-9 w-7 md:w-9 justify-center"
            >
              <RefreshCw className={`h-3 w-3 md:h-4 md:w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Atualizar</span>
            </Button>
          </div>
        </div>
      </PageHeader>

      <PageWrapper>
        <div className="space-y-4 md:space-y-6">
          {/* Stats Cards */}
          <StatCards stats={MOCK_DATA.stats} isLoading={isLoading} />
          
          {/* Quick Links */}
          <div className="mb-4 md:mb-8">
            <h3 className="text-sm md:text-lg font-medium mb-2 md:mb-4">Atalhos Rápidos</h3>
            {renderQuickLinks()}
          </div>
          
          {/* Charts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
            {/* Sales Chart */}
            <SalesChart data={MOCK_DATA.dailySales} isLoading={isLoading} />
            
            {/* Payment Methods Chart */}
            <PaymentMethodsChart data={MOCK_DATA.paymentMethods} isLoading={isLoading} />
            
            {/* Top Partners Chart */}
            <TopPartnersChart data={MOCK_DATA.topPartners} isLoading={isLoading} />
            
            {/* Client Growth Chart */}
            <ClientGrowthChart data={MOCK_DATA.clientGrowth} isLoading={isLoading} />
          </div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
