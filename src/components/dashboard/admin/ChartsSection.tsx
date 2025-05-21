
import { useMediaQuery } from "@/hooks/use-media-query";
import SalesChart from "./SalesChart";
import PaymentMethodsChart from "./PaymentMethodsChart";
import TopPartnersChart from "./TopPartnersChart";
import ClientGrowthChart from "./ClientGrowthChart";

interface ChartsSectionProps {
  salesData: Array<{ name: string; gross: number; net: number }>;
  paymentMethodsData: Array<{ name: string; value: number; color: string; percent: number }>;
  topPartnersData: Array<{ name: string; value: number; commission: number }>;
  clientGrowthData: Array<{ name: string; clients: number }>;
  isLoading: boolean;
}

export function ChartsSection({
  salesData,
  paymentMethodsData,
  topPartnersData,
  clientGrowthData,
  isLoading
}: ChartsSectionProps) {
  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 767px)");
  
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 mt-4 md:mt-6">
      {/* Sales Chart - Always visible */}
      <SalesChart data={salesData} isLoading={isLoading} />
      
      {/* Hidden on mobile, visible on larger screens */}
      {!isMobile && (
        <>
          {/* Payment Methods Chart */}
          <PaymentMethodsChart data={paymentMethodsData} isLoading={isLoading} />
          
          {/* Partners and Growth Charts - Stack on all screens, side by side on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Top Partners Chart */}
            <TopPartnersChart data={topPartnersData} isLoading={isLoading} />
            
            {/* Client Growth Chart */}
            <ClientGrowthChart data={clientGrowthData} isLoading={isLoading} />
          </div>
        </>
      )}
    </div>
  );
}
