
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
          <div className="bg-muted/40 rounded-lg p-0.5 flex">
            <Button 
              variant={performanceFilter === "all" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setPerformanceFilter("all")}
              className="h-8 text-xs"
            >
              Todos
            </Button>
            <Button 
              variant={performanceFilter === "above90" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setPerformanceFilter("above90")}
              className="h-8 text-xs"
            >
              &ge; 90%
            </Button>
            <Button 
              variant={performanceFilter === "below90" ? "secondary" : "ghost"} 
              size="sm"
              onClick={() => setPerformanceFilter("below90")}
              className="h-8 text-xs"
            >
              &lt; 90%
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <AnimatePresence mode="wait">
          <motion.div 
            className="h-80"
            key={performanceFilter}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <BarChart 
              data={filteredData} 
              color="#3b82f6" // Azul para SLA
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              formatter={(value) => `${value}%`}
            />
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SLAChart;
