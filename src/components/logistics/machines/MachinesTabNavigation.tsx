
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MachinesAllTab from "./MachinesAllTab";
import MachinesStockTab from "./MachinesStockTab";
import MachinesClientsTab from "./MachinesClientsTab";
import MachinesStatsTab from "./MachinesStatsTab";
import { useDialog } from "@/hooks/use-dialog";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import { useMachines } from "@/hooks/logistics/use-machines";
import { useAuth } from "@/contexts/AuthContext";

const MachinesTabNavigation = () => {
  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const newMachineDialog = useDialog();
  const { user } = useAuth();
  const { machines, stats, fetchMachines, isLoading } = useMachines({
    enableRealtime: true,
    initialFetch: true,
  });

  const handleAddNewMachine = () => {
    newMachineDialog.open();
  };
  
  const handleNewMachineSuccess = () => {
    fetchMachines();
  };

  // Filter machines based on search term and filters
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = !searchTerm 
      || machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
      || machine.model.toLowerCase().includes(searchTerm.toLowerCase())
      || (machine.client?.business_name && machine.client.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesModel = !modelFilter || machine.model === modelFilter;
    const matchesStatus = !statusFilter || machine.status === statusFilter;
    
    return matchesSearch && matchesModel && matchesStatus;
  });

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
            machines={filteredMachines}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="stock">
          <MachinesStockTab 
            machines={machines}
            isLoading={isLoading}
            onAddNewClick={handleAddNewMachine}
          />
        </TabsContent>
        
        <TabsContent value="clients">
          <MachinesClientsTab 
            machines={machines.filter(m => m.client_id)}
            isLoading={isLoading}
          />
        </TabsContent>
        
        <TabsContent value="stats">
          <MachinesStatsTab stats={stats} />
        </TabsContent>
      </Tabs>

      <NewMachineDialog 
        open={newMachineDialog.isOpen} 
        onOpenChange={newMachineDialog.close} 
        onSuccess={handleNewMachineSuccess}
      />
    </>
  );
};

export default MachinesTabNavigation;
