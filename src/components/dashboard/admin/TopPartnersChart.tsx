
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "recharts";
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
    name: item.name,
    value: item.commission
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Parceiros por Comissão</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="h-80">
            <CustomBarChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPartnersChart;
