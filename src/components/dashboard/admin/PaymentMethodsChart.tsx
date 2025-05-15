
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

interface PaymentMethodsChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  isLoading?: boolean;
}

const COLORS = ["#3b82f6", "#22c55e", "#f59e0b"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm text-muted-foreground">
          {`${(payload[0].payload.percent * 100).toFixed(1)}%`}
        </p>
      </div>
    );
  }
  return null;
};

const PaymentMethodsChart = ({ data, isLoading = false }: PaymentMethodsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsChart;
