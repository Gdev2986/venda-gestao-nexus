
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PaymentStatus, PaymentMethod, Sale } from "@/types";
import SalesTable from "@/components/dashboard/SalesTable";
import SalesChart from "@/components/dashboard/SalesChart";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ClientActions from "@/components/dashboard/ClientActions";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalClients: 120,
    totalRevenue: 25000,
    currentBalance: 15000,
    pendingPayments: 8,
    totalSales: 245,
    totalTransactions: 245,
    averageValue: 102.04
  });

  const [isLoading, setIsLoading] = useState(true);

  // Mock data for charts
  const chartData = [
    { date: '01/05', value: 1200 },
    { date: '02/05', value: 1800 },
    { date: '03/05', value: 1400 },
    { date: '04/05', value: 2000 },
    { date: '05/05', value: 2200 },
    { date: '06/05', value: 1800 },
    { date: '07/05', value: 2400 },
  ];

  // Mock data for payment methods chart
  const paymentMethodsData = [
    { method: PaymentMethod.CREDIT, amount: 12500, percentage: 50 },
    { method: PaymentMethod.DEBIT, amount: 7500, percentage: 30 },
    { method: PaymentMethod.PIX, amount: 5000, percentage: 20 },
  ];

  // Mock data for recent transactions
  const recentTransactions: Sale[] = [
    { 
      id: '1', 
      code: 'SALE001',
      terminal: 'TERM001',
      date: '2023-05-01T10:30:00',
      client_name: 'Empresa A', 
      gross_amount: 1500, 
      net_amount: 1425,
      paymentMethod: PaymentMethod.CREDIT
    },
    { 
      id: '2', 
      code: 'SALE002',
      terminal: 'TERM002',
      date: '2023-05-02T14:45:00',
      client_name: 'Empresa B', 
      gross_amount: 2000, 
      net_amount: 1900,
      paymentMethod: PaymentMethod.DEBIT
    },
    { 
      id: '3', 
      code: 'SALE003',
      terminal: 'TERM001',
      date: '2023-05-03T09:15:00',
      client_name: 'Empresa C', 
      gross_amount: 1200, 
      net_amount: 1140,
      paymentMethod: PaymentMethod.PIX
    },
    { 
      id: '4', 
      code: 'SALE004',
      terminal: 'TERM003',
      date: '2023-05-03T16:20:00',
      client_name: 'Empresa D', 
      gross_amount: 3000, 
      net_amount: 2850,
      paymentMethod: PaymentMethod.CREDIT
    },
    { 
      id: '5', 
      code: 'SALE005',
      terminal: 'TERM002',
      date: '2023-05-04T11:05:00',
      client_name: 'Empresa E', 
      gross_amount: 1800, 
      net_amount: 1710,
      paymentMethod: PaymentMethod.DEBIT
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral das suas vendas e operações"
      />
      <PageWrapper>
        <DashboardHeader />
        
        <div className="mt-4">
          <StatsCards stats={stats} loading={isLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Vendas recentes</h3>
              <SalesChart data={chartData} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Métodos de pagamento</h3>
              <div className="h-[300px] flex items-center justify-center">
                {isLoading ? (
                  <p>Carregando dados...</p>
                ) : (
                  <div className="space-y-4 w-full">
                    {paymentMethodsData.map((item) => (
                      <div key={item.method} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.method}</span>
                          <span className="font-bold">R$ {item.amount.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">{item.percentage}%</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-4">Transações recentes</h3>
              <SalesTable sales={recentTransactions} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4">
          <ClientActions />
        </div>
      </PageWrapper>
    </div>
  );
};

export default Dashboard;
