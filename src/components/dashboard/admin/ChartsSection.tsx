
import React from 'react';
import SalesChart from './SalesChart';
import PaymentMethodsChart from './PaymentMethodsChart';
import TopPartnersChart from './TopPartnersChart';
import { ClientGrowthChart } from './ClientGrowthChart';

export const ChartsSection = ({ salesData, clientData, partnersData, paymentsData }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      <SalesChart data={salesData} />
      <ClientGrowthChart data={clientData} />
      <PaymentMethodsChart data={paymentsData} />
      <TopPartnersChart data={partnersData} />
    </div>
  );
};
