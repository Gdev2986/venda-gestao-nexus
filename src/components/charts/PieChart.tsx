
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color?: string; // Make color optional, we'll use default colors if not provided
  }[];
  dataKey: string;
  nameKey?: string;
  height?: number;
  formatter?: (value: number) => string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
}

export const PieChart = ({
  data,
  dataKey,
  nameKey = "name",
  height = 300,
  formatter,
  innerRadius = 0,
  outerRadius = 80,
  paddingAngle = 0
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false} // Remove label lines for mobile
          label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''} // Only show labels for segments > 5%
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
          contentStyle={{ fontSize: '12px' }} // Smaller font for mobile
        />
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} // Smaller font for mobile
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
