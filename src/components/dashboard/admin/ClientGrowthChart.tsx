
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/charts';

interface ClientGrowthChartProps {
  data?: {
    name: string;
    clients: number;
  }[];
}

export const ClientGrowthChart = ({ data }: ClientGrowthChartProps) => {
  // Ensure we have default data if none is provided
  const chartData = data && data.length > 0 
    ? data 
    : [
        { name: 'Jan', clients: 0 },
        { name: 'Fev', clients: 0 },
        { name: 'Mar', clients: 0 },
      ];

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-0">
        <CardTitle>Crescimento de Clientes</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 h-[300px] flex items-center">
        <LineChart 
          data={chartData}
          xAxisKey="name"
          dataKey="clients"
          margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
        />
      </CardContent>
    </Card>
  );
};
