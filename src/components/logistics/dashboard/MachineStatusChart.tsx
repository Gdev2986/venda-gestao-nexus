
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart } from "@/components/charts";

interface MachineStatusChartProps {
  data: Array<{ name: string; value: number }>;
}

const MachineStatusChart: React.FC<MachineStatusChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Status das Máquinas</CardTitle>
        <CardDescription>Distribuição por status atual</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <PieChart data={data} dataKey="value" />
      </CardContent>
    </Card>
  );
};

export default MachineStatusChart;
