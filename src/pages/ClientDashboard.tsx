
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { subDays } from "date-fns";
import { generateMockSales, generateDailySalesData, generatePaymentMethodsData } from "@/utils/sales-utils";

// Import the components
import DateRangeFilter, { DateRange } from "@/components/dashboard/client/DateRangeFilter";
import StatsCards from "@/components/dashboard/client/StatsCards";
import MainOverviewTabs from "@/components/dashboard/client/MainOverviewTabs";
import SidebarContent from "@/components/dashboard/client/SidebarContent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { BalanceCards } from "@/components/payments/BalanceCards";

const ClientDashboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [paginatedTransactions, setPaginatedTransactions] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [paginatedMachines, setPaginatedMachines] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingPayments: 0,
    completedPayments: 0,
    clientBalance: 15000, // Mock client balance value
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<any[]>([]);
  
  // Pagination states
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [machinesPage, setMachinesPage] = useState(1);
  const transactionsPerPage = 5;
  const machinesPerPage = 3;
  const [totalTransactionsPages, setTotalTransactionsPages] = useState(1);
  const [totalMachinesPages, setTotalMachinesPages] = useState(1);

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
          { id: "4", model: "POS X400", serial_number: "SN22334455", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "5", model: "POS X200", serial_number: "SN33445566", status: "INACTIVE", created_at: new Date().toISOString() },
          { id: "6", model: "POS X500", serial_number: "SN44556677", status: "ACTIVE", created_at: new Date().toISOString() },
          { id: "7", model: "POS X300", serial_number: "SN55667788", status: "MAINTENANCE", created_at: new Date().toISOString() },
        ];
        
        // Generate chart data based on selected date range
        const dailySalesData = generateDailySalesData(dateRange);
        const methodsData = generatePaymentMethodsData(dateRange);
        
        setTransactions(mockTransactions);
        setMachines(mockMachines);
        setSalesData(dailySalesData);
        setPaymentMethodsData(methodsData);

        // Filter transactions by date
        filterTransactionsByDate(mockTransactions, dateRange);
        
        // Calculate machines pagination
        setTotalMachinesPages(Math.ceil(mockMachines.length / machinesPerPage));
        updateMachinesPagination(mockMachines, machinesPage, machinesPerPage);
        
        // Reset to first page when data changes
        setTransactionsPage(1);
        setMachinesPage(1);
        
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

  // Effect for paginating transactions when filtered transactions or page changes
  useEffect(() => {
    const startIndex = (transactionsPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    setPaginatedTransactions(filteredTransactions.slice(startIndex, endIndex));
  }, [filteredTransactions, transactionsPage, transactionsPerPage]);

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
    
    setFilteredTransactions(filtered);
    setTotalTransactionsPages(Math.ceil(filtered.length / transactionsPerPage));
    
    // Keep the clientBalance value, but update other stats
    setStats(prevStats => ({
      totalSales,
      pendingPayments,
      completedPayments,
      clientBalance: prevStats.clientBalance, // Keep the existing clientBalance
    }));
  };

  const updateMachinesPagination = (machines: any[], page: number, perPage: number) => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    setPaginatedMachines(machines.slice(startIndex, endIndex));
  };

  // Handle date range selection
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    // The useEffect will trigger data reload with new date range
  };

  // Handle page changes
  const handleTransactionsPageChange = (page: number) => {
    setTransactionsPage(page);
  };

  const handleMachinesPageChange = (page: number) => {
    setMachinesPage(page);
    updateMachinesPagination(machines, page, machinesPerPage);
  };

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      {/* Always visible Balance Card */}
      <BalanceCards clientBalance={stats.clientBalance} />
      
      {/* Date range filter after the balance cards */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h2 className="text-lg font-semibold mb-2 sm:mb-0">Filtrar Dados</h2>
          <DateRangeFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </Card>
      
      {/* Filtered Stats Cards - These change based on the date filter */}
      <StatsCards stats={stats} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MainOverviewTabs
            salesData={salesData}
            paymentMethodsData={paymentMethodsData}
            filteredTransactions={paginatedTransactions}
            machines={paginatedMachines}
            loading={loading}
            transactionsPage={transactionsPage}
            totalTransactionsPages={totalTransactionsPages}
            onTransactionsPageChange={handleTransactionsPageChange}
            machinesPage={machinesPage}
            totalMachinesPages={totalMachinesPages}
            onMachinesPageChange={handleMachinesPageChange}
          />
        </div>
        
        <div>
          <SidebarContent loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
