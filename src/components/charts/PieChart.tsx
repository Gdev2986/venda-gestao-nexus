import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number; color: string }[];
}

const CustomPieChart: React.FC<PieChartProps> = ({ data }) => {
  // Function to calculate the total value
  const totalValue = data.reduce((sum, entry) => sum + entry.value, 0);

  // Function to format the label with percentage
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Replace the function that returns a number with an actual number
  const innerRadius = 60; // or another static number that makes sense

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          innerRadius={innerRadius}
        >
          {
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
