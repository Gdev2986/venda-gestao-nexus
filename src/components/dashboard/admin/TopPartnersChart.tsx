
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { BarChart as CustomBarChart } from "@/components/charts";
import { motion } from "framer-motion";

interface TopPartnersChartProps {
  data: Array<{
    name: string;
    value: number;
    commission: number;
  }>;
  isLoading?: boolean;
}

const TopPartnersChart = ({ data, isLoading = false }: TopPartnersChartProps) => {
  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: item.name.replace('Parceiro ', 'P'),  // Shorten names for mobile
    value: item.commission,
    // Add animation delay based on index
    animationDelay: index * 150
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base sm:text-lg">Top 5 Parceiros por Comissão</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <motion.div 
            className="h-64 sm:h-72 md:h-80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CustomBarChart 
              data={chartData}
              xAxisKey="name"
              dataKey="value"
              formatter={(value) => formatCurrency(value)}
              color="#8b5cf6" // Cor roxa para destacar
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPartnersChart;
