
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface RequestsPieChartProps {
  data: ChartData[];
}

const RequestsPieChart = ({ data }: RequestsPieChartProps) => {
  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
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
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm mt-1">
            {payload[0].value} ({(payload[0].payload.percent * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Add percent property to data for label calculation
  const dataWithPercent = data.map(item => {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    return {
      ...item,
      percent: item.value / total
    };
  });

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {dataWithPercent.map((entry, index) => (
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
                  floodColor={entry.color}
                  floodOpacity="0.3"
                />
              </filter>
            ))}
          </defs>
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={50}
            paddingAngle={3}
            dataKey="value"
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {dataWithPercent.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                strokeWidth={1}
                stroke="hsl(var(--background))"
                filter={`url(#shadow-${index})`}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsPieChart;
