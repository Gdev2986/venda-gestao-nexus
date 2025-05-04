
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { DashboardStats } from "@/types";
import StatsCards from "@/components/dashboard/client/StatsCards";
import MainOverviewTabs from "@/components/dashboard/client/MainOverviewTabs";
import SidebarContent from "@/components/dashboard/client/SidebarContent";
import DateRangeFilter from "@/components/dashboard/client/DateRangeFilter";

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalRevenue: 0,
    currentBalance: 0,
    totalTransactions: 0,
    averageValue: 0,
    pendingPayments: 0,
    salesByPaymentMethod: [],
    recentSales: []
  });
  
  const [salesData, setSalesData] = useState([
    { date: '01/05', value: 5000 },
    { date: '02/05', value: 4200 },
    { date: '03/05', value: 6800 },
    { date: '04/05', value: 5500 },
    { date: '05/05', value: 7300 },
    { date: '06/05', value: 8200 },
    { date: '07/05', value: 7800 },
  ]);
  
  const [paymentMethodsData, setPaymentMethodsData] = useState([
    { name: 'Crédito', value: 65 },
    { name: 'Débito', value: 25 },
    { name: 'Pix', value: 10 },
  ]);
  
  const [filteredTransactions, setFilteredTransactions] = useState([
    {
      id: '1',
      date: '2023-05-01T14:30:00Z',
      description: 'Venda Terminal #3',
      amount: 156.78,
      type: 'credit',
      machine: 'Terminal #3',
    },
    {
      id: '2',
      date: '2023-05-01T11:15:00Z',
      description: 'Venda Terminal #1',
      amount: 89.90,
      type: 'credit',
      machine: 'Terminal #1',
    },
    {
      id: '3',
      date: '2023-04-30T17:45:00Z',
      description: 'Venda Terminal #2',
      amount: 245.50,
      type: 'debit',
      machine: 'Terminal #2',
    },
  ]);
  
  const [machines, setMachines] = useState([
    { id: '1', name: 'Terminal #1', status: 'active', transactions: 156, revenue: 12500 },
    { id: '2', name: 'Terminal #2', status: 'active', transactions: 98, revenue: 8700 },
    { id: '3', name: 'Terminal #3', status: 'maintenance', transactions: 67, revenue: 5400 },
  ]);
  
  const [pendingActions, setPendingActions] = useState([
    { id: '1', title: 'Pagamento pendente', description: 'R$ 1.256,78', type: 'payment', date: '2023-05-15' },
    { id: '2', title: 'Manutenção Terminal #3', description: 'Terminal com erro de comunicação', type: 'maintenance', date: '2023-05-05' },
  ]);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalClients: 1,
        totalRevenue: 26500,
        currentBalance: 14780,
        totalTransactions: 321,
        averageValue: 82.55,
        pendingPayments: 1,
        salesByPaymentMethod: [],
        recentSales: []
      });
      setLoading(false);
    }, 1500);
  }, []);
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    console.log('Date range changed:', range);
    // In a real app, this would fetch new data based on the date range
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Bem-vindo ao seu painel de controle.
            </p>
          </div>
          <DateRangeFilter onChange={handleDateRangeChange} />
        </div>
        
        <StatsCards stats={stats} loading={loading} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2">
            <MainOverviewTabs 
              salesData={salesData}
              paymentMethodsData={paymentMethodsData}
              filteredTransactions={filteredTransactions}
              machines={machines}
              pendingActions={pendingActions}
              loading={loading}
              onMachineSelect={(id) => console.log('Machine selected:', id)}
              onTransactionSelect={(id) => console.log('Transaction selected:', id)}
              onActionSelect={(id) => console.log('Action selected:', id)}
              onDateRangeChange={handleDateRangeChange}
              onAllTransactions={() => console.log('View all transactions')}
            />
          </div>
          <div className="col-span-1">
            <SidebarContent 
              machines={machines}
              pendingActions={pendingActions}
              loading={loading}
              onMachineSelect={(id) => console.log('Machine selected:', id)}
              onActionSelect={(id) => console.log('Action selected:', id)}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
