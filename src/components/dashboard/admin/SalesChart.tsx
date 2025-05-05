
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface SalesChartProps {
  data: Array<{
    name: string;
    gross: number;
    net: number;
  }>;
  isLoading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">
          Bruto: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-sm text-muted-foreground">
          Líquido: {formatCurrency(payload[1].value)}
        </p>
      </div>
    );
  }
  return null;
};

const SalesChart = ({ data, isLoading = false }: SalesChartProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Vendas (Últimos 7 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 bg-muted animate-pulse rounded flex items-center justify-center">
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => `R$ ${value}`} 
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar name="Valor Bruto" dataKey="gross" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar name="Valor Líquido" dataKey="net" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesChart;
