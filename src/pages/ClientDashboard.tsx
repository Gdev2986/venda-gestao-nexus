
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { subDays } from "date-fns";
import { generateMockSales, generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";

// Import the components
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
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<any[]>([]);

  // Fetch mock data and apply filters based on date range
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Generate mock data based on selected date range
        const mockTransactions = generateMockSales(50, dateRange);
        
        // Mock machines data
        const mockMachines = [
          { id: "1", model: "POS X200", serial_number: "SN12345678", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "2", model: "POS X300", serial_number: "SN87654321", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "3", model: "POS X100", serial_number: "SN11223344", status: "MAINTENANCE", created_at: new Date().toISOString() },
        ];
        
        // Generate chart data based on selected date range
        const dailySalesData = generateDailySalesData(dateRange);
        const methodsData = generatePaymentMethodsData(dateRange);
        
        setTransactions(mockTransactions);
        setMachines(mockMachines);
        setSalesData(dailySalesData);
        setPaymentMethodsData(methodsData);

        // Filter transactions by date (this is already done in the mock data generation now)
        filterTransactionsByDate(mockTransactions, dateRange);
        
        // Simulate loading delay
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
  }, [dateRange, toast]);

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
    // The useEffect will trigger data reload with new date range
  };

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
