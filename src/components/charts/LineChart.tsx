
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface LineChartProps {
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  margin?: { top: number; right: number; left: number; bottom: number };
}

export const LineChart = ({
  data,
  dataKey = "total",
  xAxisKey = "name",
  height = 300,
  color = "hsl(var(--primary))",
  formatter,
  margin = { top: 10, right: 30, left: 20, bottom: 20 }
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }} // Smaller font for mobile
        />
        <YAxis 
          tickFormatter={(value) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tick={{ fontSize: 12 }} // Smaller font for mobile
          width={35} // Smaller width for mobile
        />
        <Tooltip 
          formatter={(value: any) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
          contentStyle={{ fontSize: '12px' }} // Smaller tooltip for mobile
        />
        <Legend wrapperStyle={{ fontSize: '12px' }} /> {/* Smaller legend for mobile */}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          activeDot={{ r: 5 }}
          dot={{ r: 2.5 }} // Smaller dots for mobile
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
