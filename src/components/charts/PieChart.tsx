
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

interface PieChartProps {
  data: any[];
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
  // Calculate a responsive outerRadius based on container size
  // This is a fallback - we'll use CSS for most of the responsiveness
  const responsiveOuterRadius = (width: number) => {
    const baseSize = Math.min(width * 0.35, outerRadius);
    return baseSize;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false} // Remove label lines for mobile
          label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''} // Only show labels for segments > 5%
          outerRadius={({ width }) => responsiveOuterRadius(width)}
          innerRadius={innerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
