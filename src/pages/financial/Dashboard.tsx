
import { PageHeader } from "@/components/page/PageHeader";

const FinancialDashboard = () => {
  return (
    <div className="container mx-auto py-10">
      <PageHeader 
        title="Dashboard Financeiro" 
        description="Visão geral do sistema financeiro"
      />
      
      <div className="mt-8">
        <p>Bem-vindo ao painel financeiro. Selecione uma opção no menu lateral para começar.</p>
      </div>
    </div>
  );
};

export default FinancialDashboard;
