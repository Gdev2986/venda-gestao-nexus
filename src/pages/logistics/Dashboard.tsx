import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, PackageCheck, ShoppingBag } from "lucide-react";
import { DoughnutChart } from "@/components/charts/DoughnutChart";

const requestTypesData = [
  { name: 'Instalação', value: 35, color: '#0088FE' },
  { name: 'Manutenção', value: 25, color: '#00C49F' },
  { name: 'Reparo', value: 15, color: '#FFBB28' },
  { name: 'Outros', value: 25, color: '#FF8042' },
];

const machineStatusData = [
  { name: 'Online', value: 70, color: '#00C49F' },
  { name: 'Offline', value: 30, color: '#FF8042' },
];

const LogisticsDashboard = () => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total de Máquinas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Máquinas</CardTitle>
          <ShoppingBag className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
          <p className="text-sm text-gray-500">
            <ArrowRight className="h-4 w-4 mr-2 inline-block" />
            Total de máquinas sob gestão
          </p>
        </CardContent>
      </Card>

      {/* Card 2: Máquinas Online */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Máquinas Online</CardTitle>
          <PackageCheck className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">180</div>
          <p className="text-sm text-gray-500">
            <ArrowUpRight className="h-4 w-4 mr-2 inline-block" />
            <span className="text-green-500">+20%</span> em relação ao mês passado
          </p>
        </CardContent>
      </Card>

      {/* Card 3: Solicitações de Suporte Pendentes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitações Pendentes</CardTitle>
          <ShoppingBag className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32</div>
          <p className="text-sm text-gray-500">
            <Badge variant="secondary">
              <ArrowRight className="h-4 w-4 mr-2 inline-block" />
              Ver todas
            </Badge>
          </p>
        </CardContent>
      </Card>

      {/* Card 4: Nível de Satisfação do Cliente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfação do Cliente</CardTitle>
          <PackageCheck className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">92%</div>
          <p className="text-sm text-gray-500">
            <ArrowUpRight className="h-4 w-4 mr-2 inline-block" />
            <span className="text-green-500">+5%</span> em relação ao mês passado
          </p>
        </CardContent>
      </Card>

      {/* Card 5: Tipos de Solicitação */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Tipos de Solicitação</CardTitle>
        </CardHeader>
        <CardContent>
          <DoughnutChart
            data={requestTypesData}
            dataKey="value"
          />
        </CardContent>
      </Card>

      {/* Card 6: Status das Máquinas */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Status das Máquinas</CardTitle>
        </CardHeader>
        <CardContent>
          <DoughnutChart
            data={machineStatusData}
            dataKey="value"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LogisticsDashboard;
