
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import { useState } from "react";
import { PaymentMethod, Sale, SalesChartData } from "@/types";

// Mock data for dashboard
const mockData = {
  currentBalance: 124500,
  yesterdayGross: 15200,
  yesterdayNet: 12350,
  totalSales: 243,
  salesChartData: [
    { method: PaymentMethod.CREDIT, amount: 1400, percentage: 20, name: "Crédito", value: 1400 },
    { method: PaymentMethod.DEBIT, amount: 1200, percentage: 18, name: "Débito", value: 1200 },
    { method: PaymentMethod.PIX, amount: 4200, percentage: 62, name: "PIX", value: 4200 }
  ] as SalesChartData[],
  recentSales: [
    { 
      id: '1', 
      code: 'VND001', 
      terminal: 'T100', 
      client_name: 'Empresa A', 
      gross_amount: 1500, 
      net_amount: 1400, 
      date: '2022-01-07', 
      payment_method: PaymentMethod.CREDIT 
    },
    { 
      id: '2', 
      code: 'VND002', 
      terminal: 'T102', 
      client_name: 'Empresa B', 
      gross_amount: 1200, 
      net_amount: 1150, 
      date: '2022-01-06', 
      payment_method: PaymentMethod.DEBIT 
    },
    { 
      id: '3', 
      code: 'VND003', 
      terminal: 'T103', 
      client_name: 'Empresa C', 
      gross_amount: 950, 
      net_amount: 900, 
      date: '2022-01-05', 
      payment_method: PaymentMethod.PIX 
    },
    { 
      id: '4', 
      code: 'VND004', 
      terminal: 'T101', 
      client_name: 'Empresa D', 
      gross_amount: 1750, 
      net_amount: 1650, 
      date: '2022-01-04', 
      payment_method: PaymentMethod.CREDIT 
    },
    { 
      id: '5', 
      code: 'VND005', 
      terminal: 'T100', 
      client_name: 'Empresa E', 
      gross_amount: 2200, 
      net_amount: 2050, 
      date: '2022-01-03', 
      payment_method: PaymentMethod.PIX 
    }
  ] as Sale[]
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  const handleDateRangeChange = (range: { from: Date; to: Date } | undefined) => {
    setDateRange(range);
    // In a real app, you would fetch new data based on date range here
    console.log("Date range changed:", range);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description="Visão geral de vendas, métricas e atividades"
      />
      
      <DashboardHeader 
        onDateRangeChange={handleDateRangeChange}
      />
      
      <StatsCards 
        currentBalance={mockData.currentBalance}
        yesterdayGross={mockData.yesterdayGross}
        yesterdayNet={mockData.yesterdayNet}
        totalSales={mockData.totalSales}
      />
      
      <PageWrapper>
        <div className="space-y-6">
          <SalesChart data={mockData.salesChartData} />
          <SalesTable sales={mockData.recentSales} />
        </div>
      </PageWrapper>
    </div>
  );
};

export default Dashboard;
