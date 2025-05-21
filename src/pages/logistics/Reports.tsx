import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DoughnutChart from "@/components/charts/DoughnutChart";

const Reports = () => {
  const typesChartData = [
    { name: 'Instalação', value: 400, color: '#0088FE' },
    { name: 'Manutenção', value: 300, color: '#00C49F' },
    { name: 'Substituição', value: 300, color: '#FFBB28' },
    { name: 'Outros', value: 200, color: '#FF8042' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Chamados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <DoughnutChart
              data={typesChartData}
              dataKey="value"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
