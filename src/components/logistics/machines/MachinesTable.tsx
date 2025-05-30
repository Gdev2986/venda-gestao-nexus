
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  MoreVertical, 
  Eye, 
  Edit, 
  User, 
  AlertTriangle 
} from "lucide-react";
import { MachineStatus } from "@/types/machine.types";
import { MachineDetailsDialog } from "./MachineDetailsDialog";

interface Machine {
  id: string;
  serialNumber: string;
  model: string;
  status: MachineStatus;
  clientId?: string;
  clientName?: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

interface MachinesTableProps {
  machines: Machine[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const MachinesTable: React.FC<MachinesTableProps> = ({
  machines,
  isLoading,
  onRefresh
}) => {
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'edit'>('view');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setDialogMode('view');
    setIsDialogOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '-';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Carregando máquinas...</span>
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Nenhuma máquina encontrada.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Série</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {machine.serialNumber}
                    {!machine.clientId && (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" title="Sem cliente vinculado" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{getStatusBadge(machine.status)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {machine.clientId ? (
                      <>
                        <User className="h-4 w-4 text-green-600" />
                        <span>{machine.clientName}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">Não vinculada</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{machine.location}</TableCell>
                <TableCell>{formatDate(machine.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewMachine(machine)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditMachine(machine)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <MachineDetailsDialog
        machine={selectedMachine}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onUpdate={onRefresh}
        mode={dialogMode}
      />
    </>
  );
};
