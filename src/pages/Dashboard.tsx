
import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
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
    total: 'amount' in item ? item.amount : item.amount
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
    <MainLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Período</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="grid gap-1.5">
                      <label
                        htmlFor="date"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Data
                      </label>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !dateRange?.from && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
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
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>

                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtros rápidos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Essa semana</SelectItem>
                    <SelectItem value="month">Esse mês</SelectItem>
                    <SelectItem value="year">Esse ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas Diárias</CardTitle>
            </CardHeader>
            <CardContent>
              <DailySalesChart data={adaptDataForChart(dailySales)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodsChart data={paymentMethods} />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
