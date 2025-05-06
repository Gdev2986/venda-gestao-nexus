
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts";

interface ClientGrowthChartProps {
  data: Array<{
    name: string;
    clients: number;
  }>;
  isLoading?: boolean;
}

const ClientGrowthChart = ({ data, isLoading = false }: ClientGrowthChartProps) => {
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.name,
    total: item.clients
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crescimento de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="h-80">
            <LineChart data={chartData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
