
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal, Edit, Copy, Trash, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Machine } from "@/types/machine.types";
import MachineTransferDialog from "../machine-dialogs/MachineTransferDialog";

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
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID copiado",
      description: "O ID da máquina foi copiado para a área de transferência.",
    });
  };

  const handleEdit = (machine: Machine) => {
    toast({
      title: "Editar máquina",
      description: `Editando a máquina ${machine.serial_number}.`,
    });
  };

  const handleDelete = (machine: Machine) => {
    toast({
      title: "Deletar máquina",
      description: `Deletando a máquina ${machine.serial_number}.`,
    });
  };

  const handleTransfer = (machine: Machine) => {
    setSelectedMachine(machine);
    setTransferDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ACTIVE: { label: "Ativa", variant: "default" as const },
      INACTIVE: { label: "Inativa", variant: "secondary" as const },
      MAINTENANCE: { label: "Manutenção", variant: "destructive" as const },
      STOCK: { label: "Estoque", variant: "outline" as const },
      BLOCKED: { label: "Bloqueada", variant: "destructive" as const },
      TRANSIT: { label: "Trânsito", variant: "secondary" as const },
    };

    const config = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: "outline" as const 
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8" />
          </div>
        ))}
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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Série</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {machines.map((machine) => (
              <TableRow key={machine.id}>
                <TableCell className="font-medium">
                  {machine.serial_number}
                </TableCell>
                <TableCell>{machine.model}</TableCell>
                <TableCell>{getStatusBadge(machine.status)}</TableCell>
                <TableCell>
                  {machine.client?.business_name || "N/A"}
                </TableCell>
                <TableCell>
                  {machine.created_at 
                    ? format(new Date(machine.created_at), "dd/MM/yyyy", { locale: ptBR })
                    : "N/A"
                  }
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleCopyId(machine.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(machine)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTransfer(machine)}>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Transferir
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleDelete(machine)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMachine && (
        <MachineTransferDialog
          open={transferDialogOpen}
          onOpenChange={setTransferDialogOpen}
          machineId={selectedMachine.id}
          machineName={selectedMachine.serial_number}
          onTransferComplete={() => {
            onRefresh();
            setTransferDialogOpen(false);
          }}
        />
      )}
    </>
  );
};
