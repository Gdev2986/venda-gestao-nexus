
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { PieChart } from "@/components/charts";

interface PaymentMethodsChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    percent: number;
  }>;
  isLoading?: boolean;
}

const PaymentMethodsChart = ({ data, isLoading = false }: PaymentMethodsChartProps) => {
  // Format data for the chart, ensuring the color property is included
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
    color: item.color, // Ensure color is passed
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base sm:text-lg">Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="flex flex-col h-64 sm:h-72 md:h-80">
            {/* Chart */}
            <div className="flex-1 min-h-0">
              <PieChart 
                data={chartData} 
                dataKey="value"
                formatter={(value) => formatCurrency(value)}
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              />
            </div>
            
            {/* Legend - Optimized for mobile with better visual design */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-2 mb-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-1.5 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-medium">{item.name}: <span className="font-bold">{item.percent}%</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsChart;
