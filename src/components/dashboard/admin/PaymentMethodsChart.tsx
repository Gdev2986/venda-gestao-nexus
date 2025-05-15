
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "@/components/charts";
import { formatCurrency } from "@/lib/utils";

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
  // Format data for the chart
  const chartData = data.map(item => ({
    name: item.name,
    value: item.value,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-64 bg-muted animate-pulse rounded flex items-center justify-center">
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
                innerRadius={0}
                outerRadius={80}
              />
            </div>
            
            {/* Legend - Optimized for mobile */}
            <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
              {data.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 mr-1 rounded-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}: {item.percent}%</span>
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
