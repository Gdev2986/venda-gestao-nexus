
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, ArrowRightLeft, Trash2 } from "lucide-react";
import { Machine, MachineStatus } from "@/types/machine.types";
import { MachineDetailsDialog } from "./MachineDetailsDialog";
import { MachineTransferModal } from '@/components/machines/MachineTransferModal';

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
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [machineToTransfer, setMachineToTransfer] = useState<Machine | null>(null);

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800">Operando</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">Em Estoque</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">Em Manutenção</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 border-gray-200 dark:border-gray-700">Inativa</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800">Bloqueada</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800">Em Trânsito</Badge>;
      default:
        return <Badge variant="outline" className="dark:border-gray-700 dark:text-gray-300">{status}</Badge>;
    }
  };

  const handleViewDetails = (machine: Machine) => {
    setSelectedMachine(machine);
    setEditMode(false);
    setDetailsOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setEditMode(true);
    setDetailsOpen(true);
  };

  const handleTransferMachine = (machine: Machine) => {
    setMachineToTransfer(machine);
    setTransferModalOpen(true);
  };

  const handleTransferComplete = () => {
    onRefresh();
    setTransferModalOpen(false);
    setMachineToTransfer(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded mb-2"></div>
          ))}
        </div>
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
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              <TableHead className="dark:text-gray-300">Número de Série</TableHead>
              <TableHead className="dark:text-gray-300">Modelo</TableHead>
              <TableHead className="dark:text-gray-300">Status</TableHead>
              <TableHead className="dark:text-gray-300">Cliente</TableHead>
              <TableHead className="dark:text-gray-300">Criado em</TableHead>
              <TableHead className="text-right dark:text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id} className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <TableCell className="font-medium dark:text-gray-200">
                  {machine.serial_number}
                </TableCell>
                <TableCell className="dark:text-gray-300">{machine.model}</TableCell>
                <TableCell>{getStatusBadge(machine.status)}</TableCell>
                <TableCell className="dark:text-gray-300">
                  {machine.client?.business_name || "Em Estoque"}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {machine.created_at 
                    ? new Date(machine.created_at).toLocaleDateString('pt-BR')
                    : "N/A"
                  }
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(machine)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditMachine(machine)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {machine.client_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTransferMachine(machine)}
                        title="Transferir máquina"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Machine Details Dialog */}
      <MachineDetailsDialog
        machine={selectedMachine}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onUpdate={onRefresh}
        mode={editMode ? 'edit' : 'view'}
      />

      {/* Transfer Modal */}
      <MachineTransferModal
        machine={machineToTransfer}
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        onTransferComplete={handleTransferComplete}
      />
    </>
  );
};
