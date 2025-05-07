
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/charts";

interface SLAChartProps {
  data: Array<{ name: string; value: number }>;
}

const SLAChart: React.FC<SLAChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Performance SLA</CardTitle>
        <CardDescription>% de solicitações atendidas dentro do prazo</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <BarChart data={data} />
      </CardContent>
    </Card>
  );
};

export default SLAChart;
