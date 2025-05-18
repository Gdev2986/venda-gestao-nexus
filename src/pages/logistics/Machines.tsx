
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import MachinesTabNavigation from "@/components/logistics/machines/MachinesTabNavigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import { useMachines } from "@/hooks/logistics/use-machines";
import MachineRegistrationTable from "@/components/logistics/machines/MachineRegistrationTable";
import MachinesStatsTab from "@/components/logistics/machines/MachinesStatsTab";
import ClientsWithMachines from "@/components/logistics/ClientsWithMachines";
import { useEffect } from "react";

const LogisticsMachines = () => {
  const [activeTab, setActiveTab] = useState("machines");
  const newMachineDialog = useDialog();
  const { machines, stats, isLoading, fetchMachines } = useMachines({
    enableRealtime: true,
    initialFetch: true,
  });
  
  // Get clients with machines
  const [clientsWithMachines, setClientsWithMachines] = useState<any[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        // First pass - just use the machines data to extract clients
        const clients = machines
          .filter(m => m.client)
          .reduce((acc, m) => {
            const clientId = m.client_id;
            if (clientId && m.client) {
              // Check if client already exists in accumulator
              const existingClient = acc.find(c => c.id === clientId);
              
              if (existingClient) {
                existingClient.machineCount += 1;
              } else {
                acc.push({
                  id: clientId,
                  business_name: m.client.business_name,
                  machineCount: 1,
                  predominantStatus: m.status // We'll just use the first machine's status
                });
              }
            }
            return acc;
          }, [] as any[]);
          
        setClientsWithMachines(clients);
        setIsLoadingClients(false);
      } catch (error) {
        console.error("Error fetching clients with machines:", error);
        setIsLoadingClients(false);
      }
    };
    
    fetchClients();
  }, [machines]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas"
        description={`Gerencie o estoque, instalações e manutenção de máquinas${stats?.total ? ` (${stats.total} total)` : ''}`}
        action={
          <Button onClick={newMachineDialog.open}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Máquina
          </Button>
        }
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="machines">Cadastro de Máquinas</TabsTrigger>
          <TabsTrigger value="clients">Clientes com Máquinas</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="machines">
          <MachineRegistrationTable />
        </TabsContent>
        
        <TabsContent value="clients">
          <ClientsWithMachines 
            clients={clientsWithMachines}
            isLoading={isLoadingClients}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <MachinesStatsTab stats={stats} />
        </TabsContent>
      </Tabs>
      
      <NewMachineDialog 
        open={newMachineDialog.isOpen}
        onOpenChange={newMachineDialog.close}
        onSuccess={fetchMachines}
      />
    </div>
  );
};

export default LogisticsMachines;
