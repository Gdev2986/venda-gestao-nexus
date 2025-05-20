
import React from 'react';
import SalesChart from './SalesChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import TopPartnersChart from './TopPartnersChart';
import { ClientGrowthChart } from './ClientGrowthChart';

interface ChartsSectionProps {
  salesData?: any[];
  clientGrowthData?: any[];  // Renamed for consistency
  partnersData?: any[];
  paymentMethodsData?: any[];  // Renamed for consistency
  isLoading?: boolean;
}

export const ChartsSection = ({ 
  salesData = [], 
  clientGrowthData = [], 
  partnersData = [], 
  paymentMethodsData = [],
  isLoading = false
}: ChartsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <SalesChart data={salesData} isLoading={isLoading} />
      <ClientGrowthChart data={clientGrowthData} />
      <PaymentMethodsChart data={paymentMethodsData} isLoading={isLoading} />
      <TopPartnersChart data={partnersData} isLoading={isLoading} />
    </div>
  );
};
