
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MachinesAllTab from "./MachinesAllTab";
import MachinesStockTab from "./MachinesStockTab";
import MachinesClientsTab from "./MachinesClientsTab";
import MachinesStatsTab from "./MachinesStatsTab";
import { useDialog } from "@/hooks/use-dialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";

const MachinesTabNavigation = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const newMachineDialog = useDialog();

  const handleAddNewMachine = () => {
    newMachineDialog.open();
  };

  return (
    <>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas Máquinas</TabsTrigger>
          <TabsTrigger value="stock">Em Estoque</TabsTrigger>
          <TabsTrigger value="clients">Com Clientes</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <MachinesAllTab
            searchTerm={searchTerm}
            modelFilter={modelFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearchTerm}
            onModelFilterChange={setModelFilter}
            onStatusFilterChange={setStatusFilter}
            onAddNewClick={handleAddNewMachine}
          />
        </TabsContent>
        
        <TabsContent value="stock">
          <MachinesStockTab />
        </TabsContent>
        
        <TabsContent value="clients">
          <MachinesClientsTab />
        </TabsContent>
        
        <TabsContent value="stats">
          <MachinesStatsTab />
        </TabsContent>
      </Tabs>

      <NewMachineDialog 
        open={newMachineDialog.isOpen} 
        onOpenChange={newMachineDialog.close} 
      />
    </>
  );
};

export default MachinesTabNavigation;
