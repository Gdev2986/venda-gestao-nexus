
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Machine } from "@/types/machine.types"; // Fixed import path
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, MoreVertical, ArrowRight, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useDialog } from "@/hooks/use-dialog";
import MachineTransferDialog from "@/components/logistics/machine-dialogs/MachineTransferDialog";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export interface MachinesAllTabProps {
  searchTerm: string;
  modelFilter: string;
  statusFilter: string;
  onSearchChange?: (value: string) => void;
  onModelFilterChange?: (value: string) => void;
  onStatusFilterChange?: (value: string) => void;
  onAddNewClick?: () => void;
  machines: Machine[];
  isLoading: boolean;
}

const MachinesAllTab: React.FC<MachinesAllTabProps> = ({
  searchTerm,
  modelFilter,
  statusFilter,
  onSearchChange = () => {},
  onModelFilterChange = () => {},
  onStatusFilterChange = () => {},
  onAddNewClick = () => {},
  machines,
  isLoading,
}) => {
  const transferDialog = useDialog();
  const [selectedMachine, setSelectedMachine] = React.useState<Machine | null>(null);
  const navigate = useNavigate();

  const handleOpenTransferDialog = (machine: Machine) => {
    setSelectedMachine(machine);
    transferDialog.open();
  };

  const handleViewDetails = (machineId: string) => {
    navigate(PATHS.LOGISTICS.MACHINE_DETAILS(machineId));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Operando</Badge>;
      case "MAINTENANCE":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Manutenção</Badge>;
      case "INACTIVE":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Inativa</Badge>;
      case "STOCK":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Estoque</Badge>;
      case "TRANSIT":
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Extract unique models for filter
  const uniqueModels = [...new Set(machines.map(machine => machine.model))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Buscar máquinas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
                    <Select            value={modelFilter || "all"}            onValueChange={(value) => onModelFilterChange(value === "all" ? "" : value)}          >            <SelectTrigger className="w-[180px]">              <SelectValue placeholder="Filtrar por modelo" />            </SelectTrigger>            <SelectContent>              <SelectItem value="all">Todos os modelos</SelectItem>              {uniqueModels.map(model => (                <SelectItem key={model} value={model}>{model}</SelectItem>              ))}            </SelectContent>          </Select>          <Select            value={statusFilter || "all"}            onValueChange={(value) => onStatusFilterChange(value === "all" ? "" : value)}          >            <SelectTrigger className="w-[180px]">              <SelectValue placeholder="Filtrar por status" />            </SelectTrigger>            <SelectContent>              <SelectItem value="all">Todos os status</SelectItem>              <SelectItem value="ACTIVE">Operando</SelectItem>              <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>              <SelectItem value="INACTIVE">Inativas</SelectItem>              <SelectItem value="STOCK">Em Estoque</SelectItem>              <SelectItem value="TRANSIT">Em Trânsito</SelectItem>            </SelectContent>          </Select>
          <Button onClick={onAddNewClick}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Máquina
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={`loading-${i}`}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-16 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : machines.length > 0 ? (
                machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      {getStatusBadge(machine.status)}
                    </TableCell>
                    <TableCell>
                      {machine.client ? machine.client.business_name : "Em Estoque"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewDetails(machine.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOpenTransferDialog(machine)}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Transferir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Nenhuma máquina encontrada. Use o botão acima para adicionar uma nova.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedMachine && (
        <MachineTransferDialog
          open={transferDialog.isOpen} 
          onOpenChange={transferDialog.close}
          machineId={selectedMachine.id}
          machineName={selectedMachine.serial_number}
          onTransferComplete={() => {
            // This will be handled by the realtime subscription
          }}
        />
      )}
    </div>
  );
};

export default MachinesAllTab;
