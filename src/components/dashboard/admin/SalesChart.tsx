
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
        <div className="bg-background border border-border rounded p-3 shadow-md">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-xs text-primary">
            <span className="font-medium">Bruto:</span> {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-accent-foreground">
            <span className="font-medium">Líquido:</span> {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Vendas Diárias</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-72 bg-muted animate-pulse rounded" />
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickMargin={8}
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
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  align="right"
                  verticalAlign="top"
                  iconSize={10}
                  wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
                />
                <Bar
                  dataKey="gross"
                  name="Bruto"
                  fill="hsl(var(--primary))"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="net"
                  name="Líquido"
                  fill="hsl(var(--accent))"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
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
