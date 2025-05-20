
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { DATE_FILTER_PRESETS, DateRangeFilters } from "@/components/dashboard/admin/DateRangeFilters";
import { QuickLinks } from "@/components/dashboard/admin/QuickLinks";
import { ChartsSection } from "@/components/dashboard/admin/ChartsSection";
import StatCards from "@/components/dashboard/admin/StatCards";
import { subDays } from "date-fns";

// Dashboard mock data - Ensure all data properties are properly initialized as arrays
const MOCK_DATA = {
  stats: {
    totalSales: 125750.50,
    grossSales: 98230.75,
    netSales: 88450.10,
    pendingRequests: 42,
    expenses: 15320.45,
    totalCommissions: 9780.65,
    currentBalance: 52480.90,
    salesGrowth: 12.5,
    isGrowthPositive: true
  },
  dailySales: [
    { name: "01/05", gross: 12500, net: 9375 },
    { name: "02/05", gross: 9800, net: 7350 },
    { name: "03/05", gross: 15200, net: 11400 },
    { name: "04/05", gross: 18500, net: 13875 },
    { name: "05/05", gross: 22300, net: 16725 },
    { name: "06/05", gross: 19800, net: 14850 },
    { name: "07/05", gross: 14500, net: 10875 }
  ],
  paymentMethods: [
    { name: "Crédito", value: 68500, color: "#3b82f6", percent: 55 },
    { name: "Débito", value: 37500, color: "#22c55e", percent: 30 },
    { name: "Pix", value: 19750, color: "#f59e0b", percent: 15 }
  ],
  topPartners: [
    { name: "Parceiro A", value: 15200, commission: 1520 },
    { name: "Parceiro B", value: 12800, commission: 1280 },
    { name: "Parceiro C", value: 9750, commission: 975 },
    { name: "Parceiro D", value: 7200, commission: 720 },
    { name: "Parceiro E", value: 5100, commission: 510 }
  ],
  clientGrowth: [
    { name: "Jan", clients: 24 },
    { name: "Fev", clients: 28 },
    { name: "Mar", clients: 35 },
    { name: "Abr", clients: 42 },
    { name: "Mai", clients: 48 },
    { name: "Jun", clients: 53 }
  ]
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const { toast } = useToast();
  
  // Function to simulate data refresh
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados do dashboard foram atualizados com sucesso."
      });
    }, 1500);
  };

  // Ensure data is properly initialized
  const salesData = MOCK_DATA.dailySales || [];
  const paymentMethodsData = MOCK_DATA.paymentMethods || [];
  const partnersData = MOCK_DATA.topPartners || [];
  const clientGrowthData = MOCK_DATA.clientGrowth || [];

  return (
    <div className="space-y-4 md:space-y-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da operação e principais métricas"
      >
        <DateRangeFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      </PageHeader>

      <div className="space-y-4 md:space-y-6">
        {/* Stats Cards */}
        <StatCards stats={MOCK_DATA.stats} isLoading={isLoading} />
        
        {/* Quick Links */}
        <div className="mt-4 md:mt-6">
          <QuickLinks />
        </div>
        
        {/* Charts Grid */}
        <ChartsSection 
          salesData={salesData}
          paymentMethodsData={paymentMethodsData}
          partnersData={partnersData}
          clientGrowthData={clientGrowthData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
