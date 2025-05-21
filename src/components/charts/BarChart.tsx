
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
  color = "hsl(var(--primary))",
  formatter,
  margin = { top: 10, right: 30, left: 20, bottom: 20 }
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={margin}>
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="95%" stopColor={color} stopOpacity={0.3} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis 
          tickFormatter={(value) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tick={{ fontSize: 12 }}
          width={40}
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip 
          formatter={(value: any) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(value)
          }
          contentStyle={{ 
            fontSize: '12px',
            backgroundColor: 'hsl(var(--background))',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px'
          }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }}
          iconType="circle"
        />
        <Bar 
          dataKey={dataKey} 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
