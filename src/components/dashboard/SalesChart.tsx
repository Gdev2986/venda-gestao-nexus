
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentMethod } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";

interface SalesChartProps {
  data: {
    method: PaymentMethod;
    amount: number;
    percentage: number;
  }[];
  isLoading?: boolean;
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

const SalesChart = ({ data, isLoading = false }: SalesChartProps) => {
  const chartData = data.map((item) => ({
    name: getPaymentMethodLabel(item.method),
    value: item.amount,
    percentage: item.percentage,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-500">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(payload[0].value)}
          </p>
          <p className="text-xs text-gray-400">
            {payload[0].payload.percentage}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Vendas por Forma de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      notation: "compact",
                      compactDisplay: "short",
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="value" name="Valor">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getPaymentMethodColor(data[index].method)}
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
