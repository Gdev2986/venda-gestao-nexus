
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart } from "@/components/charts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RequestsChartProps {
  data: Array<{ name: string; value: number; total: number }>;
}

const RequestsChart: React.FC<RequestsChartProps> = ({ data }) => {
  const [requestType, setRequestType] = useState<string>("all");
  
  // Get unique request types from data
  const requestTypes = Array.from(new Set(data.map(item => item.name.split(' ')[0])));
  
  const filteredData = requestType === "all" 
    ? data 
    : data.filter(item => item.name.toLowerCase().includes(requestType.toLowerCase()));

  return (
    <Card>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Solicitações Mensais</CardTitle>
          <Select value={requestType} onValueChange={setRequestType}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {requestTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Tendência dos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <LineChart data={filteredData} />
      </CardContent>
    </Card>
  );
};

export default RequestsChart;
