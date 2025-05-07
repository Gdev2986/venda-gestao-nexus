import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesChartData } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { PaymentMethod } from "@/types";

interface DateRange {
  from: Date;
  to?: Date;
}

const PaymentMethodsChart = ({ data }: { data: SalesChartData[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
    </AreaChart>
  </ResponsiveContainer>
);

const DailySalesChart = ({ data }: { data: SalesChartData[] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Area type="monotone" dataKey="total" stroke="#82ca9d" fill="#82ca9d" />
    </AreaChart>
  </ResponsiveContainer>
);

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date()
  });
  const [dailySales, setDailySales] = useState<SalesChartData[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<SalesChartData[]>([]);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      // Simulate data fetch for daily sales chart
      const dailySalesData = generateDailySalesData(dateRange);
      setDailySales(dailySalesData);
    }
  }, [dateRange]);

  useEffect(() => {
    // Simulate data fetch for payment methods chart
    const paymentMethodsData: SalesChartData[] = [
      { name: PaymentMethod.CREDIT, value: 45 },
      { name: PaymentMethod.DEBIT, value: 30 },
      { name: PaymentMethod.PIX, value: 25 }
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
                      <PopoverTrigger asChild>
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
                      </PopoverTrigger>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={dateRange?.from}
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={2}
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
              <DailySalesChart data={dailySales} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métodos de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentMethodsChart 
                data={paymentMethods}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
