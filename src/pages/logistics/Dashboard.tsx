
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, PackageCheck, ShoppingBag, Cog, HelpCircle } from "lucide-react";
import { DoughnutChart } from "@/components/charts/DoughnutChart";
import { StyledCard } from "@/components/ui/styled-card";
import { PageHeader } from "@/components/page/PageHeader";
import { motion } from "framer-motion";

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
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard Logística" 
        description="Visão geral das operações logísticas"
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total de Máquinas */}
        <StyledCard
          title="Total de Máquinas"
          icon={<ShoppingBag className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">245</div>
          <p className="text-sm text-muted-foreground">
            <ArrowRight className="h-4 w-4 mr-2 inline-block" />
            Total de máquinas sob gestão
          </p>
        </StyledCard>

        {/* Card 2: Máquinas Online */}
        <StyledCard
          title="Máquinas Online"
          icon={<PackageCheck className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">180</div>
          <p className="text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 mr-2 inline-block" />
            <span className="text-green-500">+20%</span> em relação ao mês passado
          </p>
        </StyledCard>

        {/* Card 3: Solicitações de Suporte Pendentes */}
        <StyledCard
          title="Solicitações Pendentes"
          icon={<HelpCircle className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">32</div>
          <p className="text-sm text-muted-foreground flex items-center">
            <Badge variant="secondary" className="flex items-center gap-1">
              <ArrowRight className="h-3 w-3" />
              Ver todas
            </Badge>
          </p>
        </StyledCard>

        {/* Card 4: Nível de Satisfação do Cliente */}
        <StyledCard
          title="Satisfação do Cliente"
          icon={<Cog className="h-4 w-4 text-purple-500" />}
          borderColor="border-purple-500"
        >
          <div className="text-2xl font-bold">92%</div>
          <p className="text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 mr-2 inline-block" />
            <span className="text-green-500">+5%</span> em relação ao mês passado
          </p>
        </StyledCard>

        {/* Card 5: Tipos de Solicitação */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="col-span-1 md:col-span-2"
        >
          <StyledCard
            title="Tipos de Solicitação"
            borderColor="border-blue-300"
          >
            <div className="h-72">
              <DoughnutChart
                data={requestTypesData}
                dataKey="value"
              />
            </div>
          </StyledCard>
        </motion.div>

        {/* Card 6: Status das Máquinas */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="col-span-1 md:col-span-2"
        >
          <StyledCard
            title="Status das Máquinas"
            borderColor="border-green-300"
          >
            <div className="h-72">
              <DoughnutChart
                data={machineStatusData}
                dataKey="value"
              />
            </div>
          </StyledCard>
        </motion.div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;
