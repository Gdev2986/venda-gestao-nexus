
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from "recharts";

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
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          tickLine={false}
        />
        <YAxis 
          tickFormatter={(value) => formatter ? formatter(value) : 
            new Intl.NumberFormat("pt-BR", {
              notation: "compact",
              compactDisplay: "short",
            }).format(value)
          }
          tick={{ fontSize: 12 }}
          width={35}
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
          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '3 3' }}
        />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          iconType="circle"  
        />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#colorGradient)"
          activeDot={{ r: 6, strokeWidth: 0 }}
          dot={{ r: 0 }}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={3}
          activeDot={{ r: 6, fill: color, strokeWidth: 2, stroke: 'white' }}
          dot={{ r: 0 }}
          animationDuration={1500}
          animationEasing="ease-in-out"
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
