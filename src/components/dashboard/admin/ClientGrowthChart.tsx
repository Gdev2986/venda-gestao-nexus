
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "@/components/charts";
import { motion } from "framer-motion";

interface ClientGrowthChartProps {
  data: Array<{
    name: string;
    clients: number;
  }>;
  isLoading?: boolean;
}

const ClientGrowthChart = ({ data, isLoading = false }: ClientGrowthChartProps) => {
  // Format data for the chart - shorten month names for mobile
  const chartData = data.map((item, index) => ({
    name: item.name.substring(0, 3), // Use only first 3 letters of month names
    total: item.clients,
    // Add an animation delay based on index
    animationDelay: index * 100
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base sm:text-lg">Crescimento de Clientes</CardTitle>
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
            <LineChart 
              data={chartData}
              color="#10b981" // Cor verde para indicar crescimento
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
              gradientFrom="#10b981"
              gradientTo="#dcfce7"
              strokeWidth={3}
              showPoints={true}
            />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientGrowthChart;
