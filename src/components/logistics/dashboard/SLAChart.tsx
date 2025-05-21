
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/charts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SLAChartProps {
  data: Array<{ name: string; value: number }>;
}

const SLAChart: React.FC<SLAChartProps> = ({ data }) => {
  const [performanceFilter, setPerformanceFilter] = useState<string>("all");
  
  // Filter data based on SLA performance
  const filteredData = performanceFilter === "all" 
    ? data 
    : performanceFilter === "above90" 
      ? data.filter(item => item.value >= 90)
      : performanceFilter === "below90" 
        ? data.filter(item => item.value < 90)
        : data;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Performance SLA</CardTitle>
            <CardDescription>% de solicitações atendidas dentro do prazo</CardDescription>
          </div>
          <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Filtrar por performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="above90">Acima de 90%</SelectItem>
                <SelectItem value="below90">Abaixo de 90%</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4 h-80">
        <BarChart 
          data={filteredData} 
          color="#3b82f6" // Azul para SLA
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        />
      </CardContent>
    </Card>
  );
};

export default SLAChart;
