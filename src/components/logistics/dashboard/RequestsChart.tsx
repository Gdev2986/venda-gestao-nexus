
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart } from "@/components/charts";

interface RequestsChartProps {
  data: Array<{ name: string; value: number; total: number }>;
}

const RequestsChart: React.FC<RequestsChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Solicitações Mensais</CardTitle>
        <CardDescription>Tendência dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <LineChart data={data} />
      </CardContent>
    </Card>
  );
};

export default RequestsChart;
