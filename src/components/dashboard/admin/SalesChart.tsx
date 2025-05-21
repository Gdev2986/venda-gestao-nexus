
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: Array<{
    name: string;
    gross: number;
    net: number;
  }>;
  isLoading?: boolean;
}

const SalesChart = ({ data, isLoading = false }: SalesChartProps) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          <p className="text-xs flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
            <span className="font-medium">Bruto:</span> {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
            <span className="font-medium">Líquido:</span> {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-base sm:text-lg">Vendas Diárias</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="h-72 bg-muted animate-pulse rounded-lg" />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                barGap={6}
              >
                <defs>
                  <linearGradient id="grossGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
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
                  width={45}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ opacity: 0.1 }} />
                <Legend
                  align="right"
                  verticalAlign="top"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                />
                <Bar
                  dataKey="gross"
                  name="Bruto"
                  fill="url(#grossGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
                <Bar
                  dataKey="net"
                  name="Líquido"
                  fill="url(#netGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
