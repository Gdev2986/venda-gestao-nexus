
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  layout?: "vertical" | "horizontal";
}

export const BarChart = ({
  data,
  dataKey = "value",
  xAxisKey = "name",
  height = 300,
  color = "hsl(var(--primary))",
  formatter,
  layout = "horizontal"
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart 
        data={data}
        layout={layout}
        margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={xAxisKey} />
            <YAxis 
              tickFormatter={(value) => formatter ? formatter(value) : 
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
          </>
        ) : (
          <>
            <XAxis 
              type="number" 
              tickFormatter={(value) => formatter ? formatter(value) : 
                new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <YAxis dataKey={xAxisKey} type="category" />
          </>
        )}
        <Tooltip 
          formatter={(value: any) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
        />
        <Legend />
        <Bar 
          dataKey={dataKey} 
          fill={color} 
          radius={layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0]} 
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
