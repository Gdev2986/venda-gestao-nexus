
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PieChart } from "@/components/charts";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the proper data type expected by this component
interface MachineStatusData {
  name: string;
  value: number;
  color: string; // Required color property
}

interface MachineStatusChartProps {
  data: MachineStatusData[];
}

const MachineStatusChart: React.FC<MachineStatusChartProps> = ({ data }) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  
  const filteredData = selectedStatus === "all" 
    ? data 
    : data.filter(item => item.name.toLowerCase() === selectedStatus.toLowerCase());

  // Make sure we include the color in the data passed to the PieChart component
  const chartData = filteredData.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Status das Máquinas</CardTitle>
            <CardDescription>Distribuição por status atual</CardDescription>
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos os Status</SelectItem>
                {data.map((item) => (
                  <SelectItem key={item.name} value={item.name.toLowerCase()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-4 h-80">
        <PieChart 
          data={chartData} 
          dataKey="value"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
        />
      </CardContent>
    </Card>
  );
};

export default MachineStatusChart;
