
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SalesTable from "@/components/dashboard/SalesTable";
import SalesChart from "@/components/dashboard/SalesChart";
import ClientActions from "@/components/dashboard/ClientActions";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sale, PaymentMethod } from "@/types";
import { startOfMonth, endOfMonth, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDateRange, setSelectedDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // Mock data for dashboard stats
  const dashboardStats = {
    totalClients: 245,
    totalRevenue: 123500,
    currentBalance: 37800,
    totalTransactions: 1850,
    averageValue: 67,
    yesterdayGrossAmount: 5739,
    yesterdayNetAmount: 5450,
    salesByPaymentMethod: [
      { method: PaymentMethod.CREDIT, amount: 35000, percentage: 65 },
      { method: PaymentMethod.DEBIT, amount: 12000, percentage: 25 },
      { method: PaymentMethod.PIX, amount: 5000, percentage: 10 },
    ],
    recentSales: [
      {
        id: "1",
        code: "VND0001",
        date: new Date().toISOString(),
        terminal: "TERM001",
        gross_amount: 150.75,
        net_amount: 143.21,
        paymentMethod: PaymentMethod.CREDIT,
        client_name: "Mercado Silva",
      },
      {
        id: "2",
        code: "VND0002",
        date: new Date().toISOString(),
        terminal: "TERM002",
        gross_amount: 89.9,
        net_amount: 85.41,
        paymentMethod: PaymentMethod.PIX,
        client_name: "Padaria Central",
      },
      {
        id: "3",
        code: "VND0003",
        date: new Date().toISOString(),
        terminal: "TERM001",
        gross_amount: 45.5,
        net_amount: 43.23,
        paymentMethod: PaymentMethod.DEBIT,
        client_name: "Farmácia Bem Estar",
      },
    ] as Sale[]
  };
  
  // Sample chart data for sales over time
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    return {
      date: format(date, "dd/MM"),
      value: Math.floor(Math.random() * 10000)
    };
  });
  
  // Sample data for recent sales
  const recentSales = [
    {
      id: "1",
      client: "Mercado Silva",
      value: 150.75,
      status: "completed",
      date: "2023-05-01"
    },
    {
      id: "2",
      client: "Padaria Central",
      value: 89.9,
      status: "completed",
      date: "2023-05-01"
    },
    {
      id: "3",
      client: "Farmácia Bem Estar",
      value: 45.5,
      status: "pending",
      date: "2023-05-01"
    },
    {
      id: "4",
      client: "Restaurante Delícia",
      value: 235.8,
      status: "completed",
      date: "2023-04-30"
    },
    {
      id: "5",
      client: "Livraria Cultura",
      value: 78.9,
      status: "completed",
      date: "2023-04-30"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setSelectedDateRange(range);
    
    // In a real app, this would fetch new data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const handleQuickDateRange = (months: number) => {
    const today = new Date();
    const from = startOfMonth(subMonths(today, months));
    const to = endOfMonth(today);
    
    setSelectedDateRange({ from, to });
    
    // In a real app, this would fetch new data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <DashboardHeader 
          selectedDateRange={selectedDateRange} 
          onDateRangeChange={handleDateRangeChange}
          onQuickDateRange={handleQuickDateRange}
        />

        <StatsCards stats={dashboardStats} loading={loading} />
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SalesChart 
            data={chartData} 
            loading={loading}
            title="Vendas por Dia"
            description={`${format(selectedDateRange.from, "dd/MM", { locale: ptBR })} - ${format(selectedDateRange.to, "dd/MM", { locale: ptBR })}`}
          />
          
          <ClientActions />
        </div>
        
        <SalesTable 
          sales={dashboardStats.recentSales} 
          loading={loading}
          title="Vendas Recentes"
          description="As últimas transações realizadas"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
