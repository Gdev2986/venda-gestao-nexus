
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DoughnutChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
  height?: number;
  dataKey: string; // Added required dataKey property
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#6ee7b7'];

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  title,
  innerRadius = 60,
  outerRadius = 80,
  showLegend = true,
  showTooltip = true,
  height = 300,
  dataKey = "value"
}) => {
  // Ensure data has colors
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || COLORS[index % COLORS.length],
  }));

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {new Intl.NumberFormat('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            }).format(payload[0].value)}
          </p>
          <p className="text-xs mt-1">
            <span className="font-medium">{(payload[0].percent * 100).toFixed(1)}%</span> do total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height }}>
      {title && <h3 className="text-center mb-4 font-medium">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            {dataWithColors.map((entry, index) => (
              <filter
                key={`shadow-${index}`}
                id={`doughnut-shadow-${index}`}
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
            data={dataWithColors}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey="name"
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {dataWithColors.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                strokeWidth={1}
                stroke="hsl(var(--background))"
                filter={`url(#doughnut-shadow-${index})`}
              />
            ))}
          </Pie>
          {showTooltip && <Tooltip content={<CustomTooltip />} />}
          {showLegend && (
            <Legend 
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DoughnutChart;
