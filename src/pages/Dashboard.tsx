
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";
import { SalesChartData } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import DailySalesChart from "@/components/dashboard/DailySalesChart";
import { PageWrapper } from "@/components/page/PageWrapper";

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

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date()
  });
  const [dailySales, setDailySales] = useState<DashboardChartData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodData[]>([]);

  useEffect(() => {
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
  }, [dateRange]);

  useEffect(() => {
    // Simulate data fetch for payment methods chart
    const paymentMethodsData: PaymentMethodData[] = [
      { name: PaymentMethod.CREDIT, amount: 45 },
      { name: PaymentMethod.DEBIT, amount: 30 },
      { name: PaymentMethod.PIX, amount: 25 }
    ];
    
    setPaymentMethods(paymentMethodsData);
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>

        <Card>
          <CardHeader>
            <CardTitle>Período</CardTitle>
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
                      Data
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
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>

              <div className="w-full md:w-auto">
                <label className="text-sm font-medium leading-none block mb-1.5">
                  Filtros rápidos
                </label>
                <Select>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vendas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px]">
                <DailySalesChart data={adaptDataForChart(dailySales)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] md:h-[300px]">
                <PaymentMethodsChart data={paymentMethods} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
