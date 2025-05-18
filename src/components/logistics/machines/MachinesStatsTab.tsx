
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

interface MachinesStatsTabProps {
  stats: any | null;
}

const MachinesStatsTab: React.FC<MachinesStatsTabProps> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-48" /></CardTitle>
            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-64 w-64 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusColors = {
    "ACTIVE": "#34D399", // green
    "INACTIVE": "#F87171", // red
    "MAINTENANCE": "#FBBF24", // yellow
    "STOCK": "#60A5FA", // blue
    "TRANSIT": "#A78BFA", // purple
  };

  const statusLabels = {
    "ACTIVE": "Operando",
    "INACTIVE": "Inativa",
    "MAINTENANCE": "Em Manutenção",
    "STOCK": "Em Estoque",
    "TRANSIT": "Em Trânsito"
  };

  // Transform status counts to chart data
  const statusData = Object.entries(stats.byStatus || {}).map(([status, count]) => ({
    name: statusLabels[status as keyof typeof statusLabels] || status,
    value: count as number,
    status
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Status das Máquinas</CardTitle>
          <CardDescription>Distribuição das máquinas por status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => 
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {statusData.map((entry) => (
                    <Cell 
                      key={entry.status} 
                      fill={statusColors[entry.status as keyof typeof statusColors] || "#9CA3AF"} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} máquina${value > 1 ? 's' : ''}`, 
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{stats.total || 0}</CardTitle>
            <CardDescription>Total de Máquinas</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{stats.stock || 0}</CardTitle>
            <CardDescription>Máquinas em Estoque</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-4xl font-bold">{stats.withClients || 0}</CardTitle>
            <CardDescription>Máquinas com Clientes</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default MachinesStatsTab;
