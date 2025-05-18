
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MachinesStat {
  name: string;
  value: number;
  color: string;
}

interface MachinesStatsTabProps {
  stats: any;
}

const MachinesStatsTab: React.FC<MachinesStatsTabProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando estatísticas...</p>
      </div>
    );
  }

  // Transform stats data for chart
  const getChartData = () => {
    const statusColors: Record<string, string> = {
      ACTIVE: '#22c55e', // green
      MAINTENANCE: '#f59e0b', // yellow
      INACTIVE: '#ef4444', // red
      STOCK: '#3b82f6', // blue
      TRANSIT: '#8b5cf6', // purple
    };

    const data: MachinesStat[] = [];

    // Add status counts to chart
    if (stats.byStatus) {
      Object.entries(stats.byStatus).forEach(([status, count]) => {
        const statusName = getStatusName(status);
        data.push({
          name: statusName,
          value: count as number,
          color: statusColors[status] || '#64748b',
        });
      });
    }

    return data;
  };

  // Get readable status name
  const getStatusName = (status: string): string => {
    switch (status) {
      case 'ACTIVE': return 'Operando';
      case 'MAINTENANCE': return 'Em Manutenção';
      case 'INACTIVE': return 'Inativa';
      case 'STOCK': return 'Em Estoque';
      case 'TRANSIT': return 'Em Trânsito';
      default: return status;
    }
  };

  // Calculate percentages
  const getPercentage = (value: number): string => {
    return stats.total > 0 ? `${Math.round((value / stats.total) * 100)}%` : '0%';
  };

  const chartData = getChartData();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Status das Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} máquinas`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-4">{stats.total}</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Em Estoque</p>
              <p className="text-2xl font-semibold">{stats.stock}</p>
              <p className="text-xs text-muted-foreground">{getPercentage(stats.stock)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Com Clientes</p>
              <p className="text-2xl font-semibold">{stats.withClients}</p>
              <p className="text-xs text-muted-foreground">{getPercentage(stats.withClients)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eficiência de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-5xl font-bold mb-4">
            {stats.total > 0 ? `${Math.round((stats.byStatus?.ACTIVE || 0) / stats.total * 100)}%` : '0%'}
          </div>
          <p className="text-sm text-muted-foreground">
            Porcentagem de máquinas em operação ativa
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachinesStatsTab;
