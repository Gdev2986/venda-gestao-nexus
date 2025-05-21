
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";
import { SalesChartData } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowUp, DollarSign, CreditCard, PercentIcon } from "lucide-react";
import { format, subDays, startOfMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import DailySalesChart from "@/components/dashboard/DailySalesChart";
import { PageWrapper } from "@/components/page/PageWrapper";
import { formatCurrency } from "@/lib/utils";

interface DateRange {
  from: Date;
  to?: Date;
}

interface DashboardChartData {
  date: string;
  amount: number;
}

interface PaymentMethodData {
  name: string;
  amount: number;
}

// Adapter function to convert our data format to what the chart component expects
const adaptDataForChart = (data: PaymentMethodData[] | DashboardChartData[]): SalesChartData[] => {
  return data.map(item => ({
    name: 'date' in item ? item.date : item.name,
    value: 'amount' in item ? item.amount : item.amount,
    total: 'amount' in item ? item.amount : item.amount // Set total for backward compatibility
  }));
};

const PaymentMethodsChart = ({ data }: { data: PaymentMethodData[] }) => (
  <div className="h-[300px]">
    <DailySalesChart data={adaptDataForChart(data)} />
  </div>
);

const StatsCard = ({ 
  icon, 
  label, 
  value, 
  trend, 
  trendText,
  trendColor = "text-green-500",
  borderColor = "border-primary"
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  trend?: React.ReactNode,
  trendText?: string, 
  trendColor?: string,
  borderColor?: string
}) => (
  <Card className={`border-l-4 ${borderColor}`}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <CardDescription>{label}</CardDescription>
        <div className="p-2 bg-muted/30 rounded-md">{icon}</div>
      </div>
      <CardTitle className="text-2xl font-bold">{value}</CardTitle>
    </CardHeader>
    {trend && (
      <CardContent>
        <div className={`text-sm flex items-center ${trendColor}`}>
          {trend}
          <span className="ml-1">{trendText}</span>
        </div>
      </CardContent>
    )}
  </Card>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [dailySales, setDailySales] = useState<DashboardChartData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock statistics data that would normally come from an API
  const mockStats = {
    dailyTotal: 4850.75,
    monthlyTotal: 42750.50,
    averageTicket: 125.35,
    topPaymentMethod: "Crédito (65%)"
  };

  useEffect(() => {
    // Simulate loading state
    setIsLoading(true);
    
    setTimeout(() => {
      if (dateRange?.from) {
        // Ensure we have both from and to for the date range
        const rangeToParse = {
          from: dateRange.from,
          to: dateRange.to || dateRange.from // Default to 'from' if 'to' is not set
        };

        // Simulate data fetch for daily sales chart
        const dailySalesData = generateDailySalesData(rangeToParse).map(item => ({
          date: item.name,
          amount: item.total
        }));
        setDailySales(dailySalesData);
      }
      
      // Simulate data fetch for payment methods chart
      const paymentMethodsData: PaymentMethodData[] = [
        { name: PaymentMethod.CREDIT, amount: 45 },
        { name: PaymentMethod.DEBIT, amount: 30 },
        { name: PaymentMethod.PIX, amount: 25 }
      ];
      
      setPaymentMethods(paymentMethodsData);
      setIsLoading(false);
    }, 800);
  }, [dateRange]);

  const handleQuickFilterChange = (value: string) => {
    const today = new Date();
    
    switch(value) {
      case "day":
        setDateRange({ from: today, to: today });
        break;
      case "week":
        setDateRange({ from: subDays(today, 7), to: today });
        break;
      case "month":
        setDateRange({ from: startOfMonth(today), to: today });
        break;
      case "year":
        setDateRange({ 
          from: new Date(today.getFullYear(), 0, 1), 
          to: today 
        });
        break;
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => setIsLoading(true)} disabled={isLoading}>
            {isLoading ? "Atualizando..." : "Atualizar dados"}
          </Button>
        </div>
        
        {/* Key metrics - Always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard 
            icon={<DollarSign className="h-5 w-5 text-primary" />}
            label="Faturamento Diário"
            value={formatCurrency(mockStats.dailyTotal)}
            trend={<ArrowUp className="h-4 w-4" />}
            trendText="12% hoje"
            borderColor="border-primary"
          />
          
          <StatsCard 
            icon={<DollarSign className="h-5 w-5 text-green-500" />}
            label="Faturamento Mensal"
            value={formatCurrency(mockStats.monthlyTotal)}
            trend={<ArrowUp className="h-4 w-4" />}
            trendText="8% este mês"
            borderColor="border-green-500"
          />
          
          <StatsCard 
            icon={<PercentIcon className="h-5 w-5 text-orange-500" />}
            label="Ticket Médio"
            value={formatCurrency(mockStats.averageTicket)}
            borderColor="border-orange-500"
          />
          
          <StatsCard 
            icon={<CreditCard className="h-5 w-5 text-blue-500" />}
            label="Meio de Pagamento"
            value={mockStats.topPaymentMethod}
            borderColor="border-blue-500"
          />
        </div>

        {/* Date filters */}
        <Card>
          <CardHeader>
            <CardTitle>Período de Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="w-full md:w-auto">
                    <label
                      htmlFor="date"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1.5"
                    >
                      Período
                    </label>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full md:w-[240px] justify-start text-left font-normal",
                        !dateRange?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy")
                        )
                      ) : (
                        "Selecionar data"
                      )}
                      </span>
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    numberOfMonths={1}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <div className="w-full md:w-auto">
                <label className="text-sm font-medium leading-none block mb-1.5">
                  Filtros rápidos
                </label>
                <Select onValueChange={handleQuickFilterChange}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Selecionar filtro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Essa semana</SelectItem>
                    <SelectItem value="month">Esse mês</SelectItem>
                    <SelectItem value="year">Esse ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts - stacked vertically on mobile */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {/* Daily Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendas Diárias</CardTitle>
              <CardDescription>
                Acompanhe a variação de suas vendas ao longo do período selecionado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[250px] md:h-[300px] bg-muted/20 animate-pulse rounded" />
              ) : (
                <div className="h-[250px] md:h-[300px]">
                  <DailySalesChart data={adaptDataForChart(dailySales)} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Methods Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
              <CardDescription>
                Distribuição percentual dos métodos de pagamento utilizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-[250px] md:h-[300px] bg-muted/20 animate-pulse rounded" />
              ) : (
                <div className="h-[250px] md:h-[300px]">
                  <PaymentMethodsChart data={paymentMethods} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
