
import React from 'react';
import SalesChart from './SalesChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import TopPartnersChart from './TopPartnersChart';
import { ClientGrowthChart } from './ClientGrowthChart';

interface ChartsSectionProps {
  salesData?: any[];
  clientGrowthData?: any[];  
  partnersData?: any[];
  paymentMethodsData?: any[];  
  isLoading?: boolean;
}

export const ChartsSection = ({ 
  salesData = [], 
  clientGrowthData = [], 
  partnersData = [], 
  paymentMethodsData = [],
  isLoading = false
}: ChartsSectionProps) => {
  // Ensure all data props are arrays, even if they come in as undefined
  const safeSalesData = Array.isArray(salesData) ? salesData : [];
  const safeClientData = Array.isArray(clientGrowthData) ? clientGrowthData : [];
  const safePartnersData = Array.isArray(partnersData) ? partnersData : [];
  const safePaymentData = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <SalesChart data={safeSalesData} isLoading={isLoading} />
      <ClientGrowthChart data={safeClientData} />
      <PaymentMethodsChart data={safePaymentData} isLoading={isLoading} />
      <TopPartnersChart data={safePartnersData} isLoading={isLoading} />
    </div>
  );
};
