
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
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={true}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={outerRadius}
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
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
