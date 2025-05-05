
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { StatsCards } from '@/components/dashboard/client/StatsCards';
import { MainOverviewTabs } from '@/components/dashboard/client/MainOverviewTabs';
import { DateRangeFilter } from '@/components/dashboard/client/DateRangeFilter';
import { SidebarContent } from '@/components/dashboard/client/SidebarContent';
import { addDays, subDays } from 'date-fns';

const UserDashboard = () => {
  // Mock data
  const stats = {
    totalClients: 0,
    totalRevenue: 0,
    totalTransactions: 0,
    averageValue: 0,
    totalSales: 0,
    pendingPayments: 0,
    currentBalance: 0,
  };

  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content area */}
        <div className="flex-1 space-y-6">
          <StatsCards stats={stats} loading={isLoading} />
          
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Visão Geral</h2>
            <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>
          
          <MainOverviewTabs 
            salesData={[]}
            paymentMethodsData={[]}
            filteredTransactions={[]}
            isLoading={isLoading}
            machines={[]}
            dateRange={dateRange}
            totalSales={0}
            totalTransactions={0}
            totalRevenue={0}
            averageValue={0}
            pendingPayments={0}
          />
        </div>
        
        {/* Sidebar content */}
        <div className="w-full lg:w-80 space-y-6">
          <SidebarContent isLoading={isLoading} />
        </div>
      </div>
    </MainLayout>
  );
};

export default UserDashboard;
