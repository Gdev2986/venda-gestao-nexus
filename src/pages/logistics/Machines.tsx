
import { PageHeader } from "@/components/page/PageHeader";
import { PATHS } from "@/routes/paths";
import MachinesTabNavigation from "@/components/logistics/machines/MachinesTabNavigation";

const LogisticsMachines = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas" 
        description="Gerencie o estoque, instalações e manutenção de máquinas"
        actionLabel="Cadastrar Máquina"
        actionLink={PATHS.LOGISTICS.MACHINE_NEW}
      />
      
      <MachinesTabNavigation />
    </div>
  );
};

export default LogisticsMachines;
