
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { cn } from "@/lib/utils";

interface SalesChartProps {
  data: {
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }[];
  isLoading?: boolean;
  className?: string;
}

const getPaymentMethodLabel = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT:
      return "Crédito";
    case PaymentMethod.DEBIT:
      return "Débito";
    case PaymentMethod.PIX:
      return "Pix";
    default:
      return method;
  }
};

const getPaymentMethodColor = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT:
      return "#0066FF"; // primary
    case PaymentMethod.DEBIT:
      return "#10B981"; // success
    case PaymentMethod.PIX:
      return "#F59E0B"; // warning
    default:
      return "#64748B"; // gray
  }
};

const SalesChart = ({ data, isLoading = false, className }: SalesChartProps) => {
  const chartData = data.map((item) => ({
    name: getPaymentMethodLabel(item.method),
    value: item.amount,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{payload[0].payload.name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(payload[0].value)}
          </p>
          <p className="text-xs mt-1 text-muted-foreground">
            <span className="font-semibold">{payload[0].payload.percentage}%</span> do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn("col-span-1 overflow-hidden", className)}>
      <CardHeader className="pb-0">
        <CardTitle className="text-lg">Vendas por Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] bg-muted animate-pulse rounded-lg" />
        ) : (
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  {data.map((item, index) => (
                    <linearGradient 
                      key={`gradient-${index}`} 
                      id={`gradient-${item.method}`} 
                      x1="0" 
                      y1="0" 
                      x2="0" 
                      y2="1"
                    >
                      <stop offset="0%" stopColor={getPaymentMethodColor(item.method)} stopOpacity={0.8} />
                      <stop offset="95%" stopColor={getPaymentMethodColor(item.method)} stopOpacity={0.3} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ opacity: 0.1 }} 
                />
                <Legend 
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                />
                <Bar 
                  dataKey="value" 
                  name="Valor" 
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${data[index].method})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
