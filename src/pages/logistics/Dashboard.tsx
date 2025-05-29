
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowUpRight, PackageCheck, ShoppingBag, HelpCircle } from "lucide-react";
import { StyledCard } from "@/components/ui/styled-card";
import { PageHeader } from "@/components/page/PageHeader";
import { motion } from "framer-motion";
import ShipmentsSection from "@/components/logistics/shipments/ShipmentsSection";

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

        {/* Card 4: Entregues */}
        <StyledCard
          title="Entregues"
          icon={<PackageCheck className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">136</div>
          <p className="text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 mr-2 inline-block" />
            Entregas concluídas
          </p>
        </StyledCard>
      </div>

      {/* Nova seção de controle logístico */}
      <ShipmentsSection />
    </div>
  );
};

export default LogisticsDashboard;
