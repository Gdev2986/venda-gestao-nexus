
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface BarChartProps {
  data: any[];
  dataKey?: string;
  xAxisKey?: string;
  height?: number;
  color?: string;
  formatter?: (value: number) => string;
  margin?: { top: number; right: number; left: number; bottom: number };
}

export const BarChart = ({
  data,
  dataKey = "value",
  xAxisKey = "name",
  height = 300,
  color = "#3b82f6",
  formatter,
  margin = { top: 10, right: 30, left: 20, bottom: 20 }
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={margin}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }} // Smaller font for mobile
          interval={0} // Show all labels
          angle={-45} // Angle labels for better fit on mobile
          textAnchor="end" // Align labels
          height={60} // More space for angled labels
        />
        <YAxis 
          tickFormatter={(value) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tick={{ fontSize: 12 }} // Smaller font for mobile
          width={40} // Smaller width for mobile
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
        <Bar 
          dataKey={dataKey} 
          fill={color} 
          radius={[4, 4, 0, 0]} // Rounded corners
          maxBarSize={50} // Limit max width for aesthetic reasons
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
