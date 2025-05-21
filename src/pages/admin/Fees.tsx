
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import TaxBlocksManager from "@/components/fees/TaxBlocksManager";
import { StyledCard } from "@/components/ui/styled-card";
import { Percent, Settings } from "lucide-react";

const AdminFees = () => {
  // Dados para as estatísticas que permanecerão
  const feeStats = {
    activeBlocks: 8,
    averageRate: 2.5,
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Taxas e Comissões" 
        description="Configure os blocos de taxas para aplicação no sistema"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StyledCard
          title="Blocos Ativos"
          icon={<Settings className="h-4 w-4 text-blue-500" />}
          borderColor="border-blue-500"
        >
          <div className="text-2xl font-bold">{feeStats.activeBlocks}</div>
          <p className="text-sm text-muted-foreground">Blocos de taxas configurados</p>
        </StyledCard>
        
        <StyledCard
          title="Taxa Média"
          icon={<Percent className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">{feeStats.averageRate}%</div>
          <p className="text-sm text-muted-foreground">Média de todas as taxas</p>
        </StyledCard>
      </div>
      
      <StyledCard borderColor="border-gray-200">
        <TaxBlocksManager />
      </StyledCard>
    </div>
  );
};

export default AdminFees;
