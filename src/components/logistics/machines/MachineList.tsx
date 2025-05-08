// Importações necessárias
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Copy, Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Machine } from "@/types";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { MachineHistoryDialog } from "@/components/logistics/machine-dialogs/MachineHistoryDialog";
import MachineTransferDialog from "@/components/logistics/machine-dialogs/MachineTransferDialog";

interface DataTableProps {
  data: Machine[];
}

interface Machine {
  id: string;
  name: string;
  client_id: string;
  client_name: string;
  created_at: string;
  updated_at: string;
}

const statuses = [
  "disponível",
  "em uso",
  "manutenção",
  "desativado",
];

export function MachineList({ data }: DataTableProps) {
  const [status, setStatus] = React.useState<string | undefined>(undefined);
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const { toast } = useToast();

  const itemsPerPage = 10;

  const filteredData = data.filter((machine) => {
    const searchRegex = new RegExp(search, "i");
    return searchRegex.test(machine.name);
  });

  const paginatedData = filteredData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleCopyMachineId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast({
      title: "ID da máquina copiado",
      description: "O ID da máquina foi copiado para a área de transferência.",
    });
  };

  const handleEditMachine = (machine: Machine) => {
    toast({
      title: "Editar máquina",
      description: `Editando a máquina ${machine.name}.`,
    });
  };

  const handleDeleteMachine = (machine: Machine) => {
    toast({
      title: "Deletar máquina",
      description: `Deletando a máquina ${machine.name}.`,
    });
  };

  const handleViewHistory = (machine: Machine) => {
    setSelectedMachine(machine);
    setShowHistoryDialog(true);
  };

  const handleTransferMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setShowTransferDialog(true);
  };

  const handleRefresh = () => {
    toast({
      title: "Máquinas atualizadas",
      description: "A lista de máquinas foi atualizada com sucesso.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Máquinas</CardTitle>
        <CardDescription>
          Gerencie as máquinas da sua empresa.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative w-full md:w-auto">
            <Input
              placeholder="Buscar máquinas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh}>Atualizar</Button>
            <Button>Adicionar Máquina</Button>
          </div>
        </div>
        <div className="relative overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell className="font-medium">{machine.id}</TableCell>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>{machine.client_name}</TableCell>
                  <TableCell>
                    {format(new Date(machine.created_at), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
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
                        <DropdownMenuItem
                          onClick={() => handleCopyMachineId(machine.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditMachine(machine)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewHistory(machine)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Ver histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTransferMachine(machine)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Transferir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteMachine(machine)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
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
        <div className="flex items-center justify-between space-x-2 py-2">
          <div className="text-sm text-muted-foreground">
            Total de máquinas: {filteredData.length}
          </div>
          <Pagination
            page={page}
            setPage={setPage}
            totalPages={totalPages}
          />
        </div>
      </CardContent>

      {showHistoryDialog && selectedMachine && (
        <MachineHistoryDialog
          open={showHistoryDialog}
          onOpenChange={() => setShowHistoryDialog(false)}
          machineId={selectedMachine.id}
          machineName={selectedMachine.name}
        />
      )}

      {showTransferDialog && selectedMachine && (
        <MachineTransferDialog
          open={showTransferDialog}
          onOpenChange={() => setShowTransferDialog(false)}
          machineId={selectedMachine.id}
          machineName={selectedMachine.name}
          currentClientId={selectedMachine.client_id}
          currentClientName={selectedMachine.client_name}
          onTransferComplete={handleRefresh}
        />
      )}
    </Card>
  );
}
