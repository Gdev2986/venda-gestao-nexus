
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { DATE_FILTER_PRESETS, DateRangeFilters } from "@/components/dashboard/admin/DateRangeFilters";
import { QuickLinks } from "@/components/dashboard/admin/QuickLinks";
import { ChartsSection } from "@/components/dashboard/admin/ChartsSection";
import StatCards from "@/components/dashboard/admin/StatCards";
import PaymentTypesTable, { PaymentTypeData } from "@/components/dashboard/admin/PaymentTypesTable";
import { subDays } from "date-fns";

// Dashboard mock data
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
  ],
  paymentTypesByInstallment: [
    { type: "PIX", installments: 1, totalAmount: 19750, salesCount: 65 },
    { type: "Débito", installments: 1, totalAmount: 37500, salesCount: 120 },
    { type: "Crédito", installments: 1, totalAmount: 8500, salesCount: 28 },
    { type: "Crédito", installments: 2, totalAmount: 9200, salesCount: 18 },
    { type: "Crédito", installments: 3, totalAmount: 12500, salesCount: 25 },
    { type: "Crédito", installments: 4, totalAmount: 6800, salesCount: 17 },
    { type: "Crédito", installments: 6, totalAmount: 15000, salesCount: 20 },
    { type: "Crédito", installments: 10, totalAmount: 5500, salesCount: 11 },
    { type: "Crédito", installments: 12, totalAmount: 11000, salesCount: 15 }
  ]
};

// Generate mock data for all installments from 1 to 21 for credit
function generateMockPaymentTypeData(): PaymentTypeData[] {
  // Start with the fixed payment types
  const result: PaymentTypeData[] = [
    { type: "PIX", installments: 1, totalAmount: 19750, salesCount: 65 },
    { type: "Débito", installments: 1, totalAmount: 37500, salesCount: 120 },
  ];
  
  // Generate data for credit from 1x to 21x
  for (let i = 1; i <= 21; i++) {
    // Base amount that decreases with more installments to simulate real-world behavior
    const baseAmount = 25000 / (1 + i/10);
    // Random variation +/- 20%
    const variation = 0.8 + Math.random() * 0.4;
    
    result.push({
      type: "Crédito",
      installments: i,
      totalAmount: Math.round(baseAmount * variation),
      salesCount: Math.round(30 * variation / (1 + i/5)),
    });
  }
  
  return result;
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState(DATE_FILTER_PRESETS.LAST_30_DAYS);
  const [dateRange, setDateRange] = useState<{from: Date; to?: Date}>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [paymentTypeData, setPaymentTypeData] = useState<PaymentTypeData[]>(
    generateMockPaymentTypeData()
  );
  const { toast } = useToast();
  
  // Function to simulate data refresh based on date range
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call with different data based on selected date range
    setTimeout(() => {
      // Generate slightly different data for each refresh to simulate real data changes
      setPaymentTypeData(generateMockPaymentTypeData());
      setIsLoading(false);
      toast({
        title: "Dados atualizados",
        description: "Os dados do dashboard foram atualizados com sucesso."
      });
    }, 1500);
  };

  // Effect to refresh data when date range changes
  useEffect(() => {
    handleRefresh();
  }, [dateRange.from, dateRange.to]);

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
        
        {/* Payment Types Table (New Component) */}
        <div className="mt-6">
          <PaymentTypesTable 
            data={paymentTypeData} 
            isLoading={isLoading} 
            dateRange={dateRange}
          />
        </div>
        
        {/* Charts Grid */}
        <ChartsSection 
          salesData={MOCK_DATA.dailySales}
          paymentMethodsData={MOCK_DATA.paymentMethods}
          partnersData={MOCK_DATA.topPartners}
          clientGrowthData={MOCK_DATA.clientGrowth}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
