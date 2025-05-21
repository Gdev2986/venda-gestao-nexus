
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Solicitações Mensais</CardTitle>
            <CardDescription>Tendência dos últimos 6 meses</CardDescription>
          </div>
          <div className="bg-muted/40 rounded-lg p-0.5 flex flex-wrap">
            <Button 
              variant={requestType === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setRequestType("all")}
              className="h-8 text-xs"
            >
              Todos
            </Button>
            {requestTypes.map((type) => (
              <Button 
                key={type} 
                variant={requestType === type.toLowerCase() ? "secondary" : "ghost"} 
                size="sm"
                onClick={() => setRequestType(type.toLowerCase())}
                className="h-8 text-xs"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          <motion.div 
            className="h-80"
            key={requestType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LineChart 
              data={filteredData}
              colors={["#f59e0b"]} // Changed from color to colors as an array
              dataKey={["value"]} // Ensure dataKey is properly passed as an array
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default RequestsChart;
