
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Cores mais suaves e harmoniosas
const COLORS = [
  "#60a5fa", // Azul
  "#34d399", // Verde
  "#fbbf24", // Amarelo
  "#f87171", // Vermelho
  "#a78bfa", // Roxo
  "#6ee7b7", // Verde água
];

interface PieChartProps {
  data: {
    name: string;
    value: number;
    color?: string;
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
  innerRadius = 60,
  outerRadius = 90,
  paddingAngle = 2
}: PieChartProps) => {
  // Create custom labels
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontWeight="600"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
        <defs>
          {data.map((entry, index) => (
            <filter
              key={`shadow-${index}`}
              id={`shadow-${index}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow 
                dx="0" 
                dy="0" 
                stdDeviation="3" 
                floodColor={entry.color || COLORS[index % COLORS.length]}
                floodOpacity="0.3"
              />
            </filter>
          ))}
        </defs>
        
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          paddingAngle={paddingAngle}
          dataKey={dataKey}
          nameKey={nameKey}
          animationDuration={1500}
          animationEasing="ease-out"
          filter="url(#shadow-0)"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || COLORS[index % COLORS.length]} 
              strokeWidth={1}
              stroke="hsl(var(--background))"
              filter={`url(#shadow-${index})`}
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
          contentStyle={{ 
            fontSize: '12px',
            backgroundColor: 'hsl(var(--background))',
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            padding: '8px 12px'
          }}
        />
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
