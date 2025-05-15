
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart as CustomBarChart } from "@/components/charts";

interface TopPartnersChartProps {
  data: Array<{
    name: string;
    value: number;
    commission: number;
  }>;
  isLoading?: boolean;
}

const TopPartnersChart = ({ data, isLoading = false }: TopPartnersChartProps) => {
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.name.replace('Parceiro ', 'P'),  // Shorten names for mobile
    value: item.commission
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Top 5 Parceiros por Comissão</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="h-64 sm:h-72 md:h-80">
            <CustomBarChart 
              data={chartData}
              xAxisKey="name"
              dataKey="value"
              formatter={(value) => formatCurrency(value)}
              // Set smaller margins for mobile
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPartnersChart;
