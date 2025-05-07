import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Info, History, ArrowRightLeft } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import MachineDetailsModal from "@/components/logistics/MachineDetailsModal";
import { MachineHistoryDialog } from "@/components/logistics/machine-dialogs/MachineHistoryDialog";
import { MachineTransferDialog } from "@/components/logistics/machine-dialogs/MachineTransferDialog";

// Prop interface
export interface MachineListProps {
  searchTerm: string;
  modelFilter: string;
  statusFilter: string;
}

// Sample data for machines
const mockMachines = [
  {
    id: "1",
    serial: "SN12345678",
    model: "POS X200",
    status: "active",
    location: "São Paulo",
    client: "Cliente A",
    lastMaintenance: "2023-01-15",
  },
  {
    id: "2",
    serial: "SN87654321",
    model: "Terminal Y100",
    status: "maintenance",
    location: "Rio de Janeiro",
    client: "Cliente B",
    lastMaintenance: "2023-02-20",
  },
  {
    id: "3",
    serial: "SN11223344",
    model: "Mobile Z50",
    status: "inactive",
    location: "Estoque",
    client: "-",
    lastMaintenance: "2022-11-05",
  },
  {
    id: "4",
    serial: "SN55667788",
    model: "POS X300",
    status: "active",
    location: "Belo Horizonte",
    client: "Cliente C",
    lastMaintenance: "2023-03-10",
  },
  {
    id: "5",
    serial: "SN99887766",
    model: "Terminal Y200",
    status: "active",
    location: "Porto Alegre",
    client: "Cliente D",
    lastMaintenance: "2023-02-28",
  },
];

const MachineList: React.FC<MachineListProps> = ({ 
  searchTerm, 
  modelFilter, 
  statusFilter 
}) => {
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<any>(null);
  
  // Dialogs state using proper hook pattern
  const detailsDialog = useDialog();
  const historyDialog = useDialog();
  const transferDialog = useDialog();

  // Load and filter machines
  useEffect(() => {
    // Apply filters
    let filtered = [...mockMachines];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        m => 
          m.serial.toLowerCase().includes(term) || 
          m.model.toLowerCase().includes(term) || 
          m.client.toLowerCase().includes(term)
      );
    }
    
    if (modelFilter) {
      const term = modelFilter.toLowerCase();
      filtered = filtered.filter(m => m.model.toLowerCase().includes(term));
    }
    
    if (statusFilter) {
      filtered = filtered.filter(m => m.status === statusFilter);
    }
    
    setMachines(filtered);
  }, [searchTerm, modelFilter, statusFilter]);

  const handleViewDetails = (machine: any) => {
    setSelectedMachine(machine);
    detailsDialog.open();
  };
  
  const handleViewHistory = (machine: any) => {
    setSelectedMachine(machine);
    historyDialog.open();
  };
  
  const handleTransferMachine = (machine: any) => {
    setSelectedMachine(machine);
    transferDialog.open();
  };

  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-500">Ativo</Badge>;
      case "maintenance":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Manutenção</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Inativo</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {machines.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Nenhuma máquina encontrada.</p>
          </CardContent>
        </Card>
      ) : (
        machines.map((machine) => (
          <Card key={machine.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{machine.model}</h3>
                    {getStatusBadge(machine.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">Serial: {machine.serial}</p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Cliente:</span> {machine.client}
                  </p>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Localização:</span> {machine.location}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(machine)}>
                    <Info className="h-4 w-4 mr-2" />
                    Detalhes
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewHistory(machine)}>
                    <History className="h-4 w-4 mr-2" />
                    Histórico
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleTransferMachine(machine)}>
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Transferir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Relatório
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
      
      {selectedMachine && (
        <>
          <MachineDetailsModal 
            open={detailsDialog.isOpen} 
            onOpenChange={detailsDialog.close} 
            machine={selectedMachine} 
          />
          
          <MachineHistoryDialog 
            isOpen={historyDialog.isOpen} 
            onClose={historyDialog.close} 
            machineId={selectedMachine.id} 
          />
          
          <MachineTransferDialog 
            open={transferDialog.isOpen} 
            onOpenChange={transferDialog.close} 
            machineId={selectedMachine.id} 
          />
        </>
      )}
    </div>
  );
};

export default MachineList;
