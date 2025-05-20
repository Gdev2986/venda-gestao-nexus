
import * as React from "react";
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
  // Format data for the chart - shorten month names for mobile
  const chartData = data.map(item => ({
    name: item.name.substring(0, 3), // Use only first 3 letters of month names
    total: item.clients
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Crescimento de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="h-64 sm:h-72 md:h-80">
            <LineChart 
              data={chartData}
              // Use smaller margins on mobile
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
