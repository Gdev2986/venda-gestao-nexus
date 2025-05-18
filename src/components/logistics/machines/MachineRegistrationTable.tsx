
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowRight, Edit, Trash2 } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog";
import { Machine, MachineStatus } from "@/types/machine.types";
import { useMachines } from "@/hooks/logistics/use-machines";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewMachineDialog from "@/components/logistics/modals/NewMachineDialog";
import MachineTransferDialog from "@/components/logistics/machine-dialogs/MachineTransferDialog";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const MachineRegistrationTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const newMachineDialog = useDialog();
  const transferDialog = useDialog();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  
  // Use the machines hook with realtime enabled
  const { machines, isLoading, fetchMachines } = useMachines({ 
    enableRealtime: true,
    initialFetch: true
  });
  
  // Filter machines based on search term
  const filteredMachines = machines.filter(machine => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      machine.serial_number.toLowerCase().includes(searchLower) ||
      machine.model.toLowerCase().includes(searchLower) ||
      (machine.client?.business_name && 
        machine.client.business_name.toLowerCase().includes(searchLower))
    );
  });

  const handleOpenTransferDialog = (machine: Machine) => {
    setSelectedMachine(machine);
    transferDialog.open();
  };

  const handleViewDetails = (machineId: string) => {
    navigate(PATHS.LOGISTICS.MACHINE_DETAILS(machineId));
  };

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Operando</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inativa</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Estoque</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleNewMachineSuccess = () => {
    toast({
      title: "Máquina cadastrada",
      description: "A máquina foi cadastrada com sucesso.",
    });
    fetchMachines();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Cadastro de Máquinas</CardTitle>
        <Button onClick={newMachineDialog.open} size="sm">
          <Plus size={16} className="mr-2" />
          Nova Máquina
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Buscar por número de série, modelo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Série</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredMachines.length > 0 ? (
                filteredMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>{getStatusBadge(machine.status)}</TableCell>
                    <TableCell>
                      {machine.client ? machine.client.business_name : "Em Estoque"}
                    </TableCell>
                    <TableCell>
                      {new Date(machine.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleViewDetails(machine.id)}
                          title="Editar detalhes"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleOpenTransferDialog(machine)}
                          title="Transferir máquina"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    {searchTerm ? (
                      <p>Nenhuma máquina encontrada com os critérios de busca.</p>
                    ) : (
                      <p>Nenhuma máquina cadastrada. Use o botão acima para adicionar.</p>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Add Machine Modal */}
        <NewMachineDialog
          open={newMachineDialog.isOpen}
          onOpenChange={newMachineDialog.close}
          onSuccess={handleNewMachineSuccess}
        />
        
        {/* Transfer Machine Modal */}
        {selectedMachine && (
          <MachineTransferDialog
            open={transferDialog.isOpen}
            onOpenChange={transferDialog.close}
            machineId={selectedMachine.id}
            machineName={selectedMachine.serial_number}
            onTransferComplete={fetchMachines}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default MachineRegistrationTable;
