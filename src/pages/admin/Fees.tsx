
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import TaxBlocksManager from "@/components/fees/TaxBlocksManager";
import { StyledCard } from "@/components/ui/styled-card";
import { Percent, Settings } from "lucide-react";
import { TaxBlocksService } from "@/services/tax-blocks.service";

const AdminFees = () => {
  const [stats, setStats] = useState({
    activeBlocks: 0,
    averageRate: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar todos os blocos de taxa
        const blocks = await TaxBlocksService.getTaxBlocks();
        
        // Contagem de blocos ativos
        const activeBlocks = blocks.length;
        
        // Cálculo da taxa média
        let totalRates = 0;
        let rateCount = 0;
        
        blocks.forEach(block => {
          if (block.rates && block.rates.length > 0) {
            block.rates.forEach(rate => {
              totalRates += rate.final_rate;
              rateCount++;
            });
          }
        });
        
        const averageRate = rateCount > 0 ? (totalRates / rateCount) : 0;
        
        setStats({
          activeBlocks,
          averageRate: parseFloat(averageRate.toFixed(2)),
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas de taxas:", error);
      }
    };
    
    fetchStats();
  }, []);

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
          <div className="text-2xl font-bold">{stats.activeBlocks}</div>
          <p className="text-sm text-muted-foreground">Blocos de taxas configurados</p>
        </StyledCard>
        
        <StyledCard
          title="Taxa Média"
          icon={<Percent className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">{stats.averageRate}%</div>
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
