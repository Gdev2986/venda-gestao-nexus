
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
              data={data}
              xAxisKey="name"
              dataKey="clients"
              strokeColor="hsl(var(--primary))"
              // Set smaller margins for mobile
              margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
              showGrid={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
