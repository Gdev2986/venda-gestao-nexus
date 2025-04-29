import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import { DashboardStats, PaymentMethod, Sale, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import ClientActions from "@/components/dashboard/ClientActions";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/use-user-role";

// Mock data for development purposes
const generateMockData = (): DashboardStats => {
  const currentBalance = Math.random() * 10000;
  const yesterdayGross = Math.random() * 1500;
  const yesterdayNet = yesterdayGross * 0.97; // 3% fee
  const totalSales = Math.floor(Math.random() * 100) + 50;

  const salesByMethod = [
    {
      method: PaymentMethod.CREDIT,
      amount: Math.random() * 5000,
      percentage: 0,
    },
    {
      method: PaymentMethod.DEBIT,
      amount: Math.random() * 3000,
      percentage: 0,
    },
    {
      method: PaymentMethod.PIX,
      amount: Math.random() * 2000,
      percentage: 0,
    },
  ];

  // Calculate percentages
  const total = salesByMethod.reduce((sum, item) => sum + item.amount, 0);
  salesByMethod.forEach(item => {
    item.percentage = parseFloat(((item.amount / total) * 100).toFixed(1));
  });

  // Generate recent sales
  const recentSales: Sale[] = [];
  for (let i = 0; i < 10; i++) {
    const grossAmount = Math.random() * 500;
    const netAmount = grossAmount * 0.97; // 3% fee
    const methods = [PaymentMethod.CREDIT, PaymentMethod.DEBIT, PaymentMethod.PIX];
    const method = methods[Math.floor(Math.random() * methods.length)];
    const terminals = ["T123456", "T789012", "T345678", "T901234"];
    
    recentSales.push({
      id: `sale_${i}`,
      code: `VND${Math.floor(Math.random() * 100000).toString().padStart(6, '0')}`,
      date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      terminal: terminals[Math.floor(Math.random() * terminals.length)],
      grossAmount,
      netAmount,
      paymentMethod: method,
      clientId: "client_1",
    });
  }

  return {
    currentBalance,
    yesterdayGrossAmount: yesterdayGross,
    yesterdayNetAmount: yesterdayNet,
    totalSales,
    salesByPaymentMethod: salesByMethod,
    recentSales,
  };
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const { toast } = useToast();
  const { userRole } = useUserRole();

  const loadData = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockData();
      setData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  const handleDateRangeChange = (range: { from: Date, to: Date }) => {
    toast({
      title: "Filtro de data atualizado",
      description: `Período selecionado: ${range.from.toLocaleDateString('pt-BR')} a ${range.to.toLocaleDateString('pt-BR')}`,
    });
    
    // In a real app, we would fetch new data based on the date range
    loadData();
  };

  return (
    <MainLayout>
      <DashboardHeader onDateRangeChange={handleDateRangeChange} />
      
      {data && (
        <>
          <StatsCards
            currentBalance={data.currentBalance}
            yesterdayGross={data.yesterdayGrossAmount}
            yesterdayNet={data.yesterdayNetAmount}
            totalSales={data.totalSales}
            isLoading={isLoading}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <SalesChart
              data={data.salesByPaymentMethod}
              isLoading={isLoading}
              className="lg:col-span-2"
            />
            
            {userRole === UserRole.CLIENT && (
              <ClientActions />
            )}
            
          </div>
          
          <SalesTable
            sales={data.recentSales}
            isLoading={isLoading}
          />
        </>
      )}
    </MainLayout>
  );
};

export default Dashboard;
