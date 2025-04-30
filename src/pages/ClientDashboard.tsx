
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { subDays } from "date-fns";
import { generateMockSales } from "@/utils/sales-utils";

// Import the newly created components
import DateRangeFilter, { DateRange } from "@/components/dashboard/client/DateRangeFilter";
import StatsCards from "@/components/dashboard/client/StatsCards";
import MainOverviewTabs from "@/components/dashboard/client/MainOverviewTabs";
import SidebarContent from "@/components/dashboard/client/SidebarContent";

const ClientDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingPayments: 0,
    completedPayments: 0,
    averageTicket: 0,
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Use a mock implementation since 'transactions' table doesn't exist yet
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Mock transactions data
        const mockTransactions = [
          { id: "1", date: new Date(2025, 3, 28).toISOString(), amount: 1500, status: "completed" },
          { id: "2", date: new Date(2025, 3, 29).toISOString(), amount: 2000, status: "completed" },
          { id: "3", date: new Date(2025, 4, 1).toISOString(), amount: 1200, status: "pending" },
          { id: "4", date: new Date(2025, 4, 2).toISOString(), amount: 800, status: "pending" },
          { id: "5", date: new Date(2025, 4, 5).toISOString(), amount: 3000, status: "completed" },
          { id: "6", date: new Date(2025, 4, 10).toISOString(), amount: 1700, status: "completed" },
          { id: "7", date: new Date(2025, 4, 12).toISOString(), amount: 950, status: "completed" },
          { id: "8", date: new Date(2025, 4, 15).toISOString(), amount: 2200, status: "completed" },
          { id: "9", date: new Date(2025, 4, 18).toISOString(), amount: 1300, status: "pending" },
          { id: "10", date: new Date(2025, 4, 20).toISOString(), amount: 1800, status: "completed" },
        ];
        
        // Mock machines data
        const mockMachines = [
          { id: "1", model: "POS X200", serial_number: "SN12345678", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "2", model: "POS X300", serial_number: "SN87654321", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "3", model: "POS X100", serial_number: "SN11223344", status: "MAINTENANCE", created_at: new Date().toISOString() },
        ];
        
        setTransactions(mockTransactions);
        setMachines(mockMachines);

        // Apply initial date filter
        filterTransactionsByDate(mockTransactions, dateRange);
        
        // Simulate loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: error.message,
        });
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const filterTransactionsByDate = (transactions: any[], range: DateRange) => {
    const filtered = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      const fromDate = new Date(range.from);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(range.to);
      toDate.setHours(23, 59, 59, 999);
      return txDate >= fromDate && txDate <= toDate;
    });
    
    // Calculate stats based on filtered transactions
    const totalSales = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    const pendingPayments = filtered
      .filter(tx => tx.status === 'pending')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const completedPayments = filtered
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);
    const averageTicket = totalSales / (filtered.length || 1);
    
    setFilteredTransactions(filtered);
    setStats({
      totalSales,
      pendingPayments,
      completedPayments,
      averageTicket,
    });
  };

  // Handle date range selection
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    filterTransactionsByDate(transactions, newRange);
  };

  const salesData = [
    { name: "Jan", total: 1200 },
    { name: "Fev", total: 1900 },
    { name: "Mar", total: 1800 },
    { name: "Abr", total: 2100 },
    { name: "Mai", total: 2400 },
    { name: "Jun", total: 2200 },
    { name: "Jul", total: 2600 },
    { name: "Ago", total: 2900 },
    { name: "Set", total: 3100 },
    { name: "Out", total: 3300 },
    { name: "Nov", total: 3400 },
    { name: "Dez", total: 3600 },
  ];

  const paymentMethodsData = [
    { name: "Crédito", value: 60 },
    { name: "Débito", value: 25 },
    { name: "Pix", value: 15 },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col gap-5 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <DateRangeFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
        
        <StatsCards stats={stats} loading={loading} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MainOverviewTabs
              salesData={salesData}
              paymentMethodsData={paymentMethodsData}
              filteredTransactions={filteredTransactions}
              machines={machines}
              loading={loading}
            />
          </div>
          
          <div>
            <SidebarContent loading={loading} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
