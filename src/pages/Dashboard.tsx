
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesChart from "@/components/dashboard/SalesChart";
import SalesTable from "@/components/dashboard/SalesTable";
import { useState } from "react";

// Mock data for dashboard
const mockData = {
  currentBalance: 124500,
  yesterdayGross: 15200,
  yesterdayNet: 12350,
  totalSales: 243,
  salesChartData: [
    { date: '2022-01-01', value: 1400 },
    { date: '2022-01-02', value: 1200 },
    { date: '2022-01-03', value: 1300 },
    { date: '2022-01-04', value: 1500 },
    { date: '2022-01-05', value: 1800 },
    { date: '2022-01-06', value: 2000 },
    { date: '2022-01-07', value: 1900 },
  ],
  recentSales: [
    { id: '1', client: 'Empresa A', value: 1500, status: 'COMPLETED', date: '2022-01-07' },
    { id: '2', client: 'Empresa B', value: 1200, status: 'PROCESSING', date: '2022-01-06' },
    { id: '3', client: 'Empresa C', value: 950, status: 'COMPLETED', date: '2022-01-05' },
    { id: '4', client: 'Empresa D', value: 1750, status: 'COMPLETED', date: '2022-01-04' },
    { id: '5', client: 'Empresa E', value: 2200, status: 'PROCESSING', date: '2022-01-03' },
  ]
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
