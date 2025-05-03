
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Painel Administrativo" 
        description="Visão geral do sistema, métricas e atividades recentes"
      />
      
      <PageWrapper>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-muted/50 rounded-md p-6 flex flex-col gap-2">
            <h3 className="font-medium">Vendas no mês</h3>
            <p className="text-3xl font-bold">R$ 124.500,00</p>
            <p className="text-sm text-muted-foreground">+12% em relação ao mês anterior</p>
          </div>
          
          <div className="bg-muted/50 rounded-md p-6 flex flex-col gap-2">
            <h3 className="font-medium">Clientes ativos</h3>
            <p className="text-3xl font-bold">243</p>
            <p className="text-sm text-muted-foreground">+5 novos neste mês</p>
          </div>
          
          <div className="bg-muted/50 rounded-md p-6 flex flex-col gap-2">
            <h3 className="font-medium">Máquinas instaladas</h3>
            <p className="text-3xl font-bold">315</p>
            <p className="text-sm text-muted-foreground">98% em funcionamento</p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-md p-6 h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Gráficos de vendas e atividade serão exibidos aqui</p>
        </div>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
