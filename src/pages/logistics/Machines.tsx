import React, { useState } from 'react';
import { Machine } from "@/types/machine.types";
import { useMachines } from "@/hooks/logistics/use-machines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import { MachineStatus } from '@/types/machine.types';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react";
import { MachineDetailsDialog } from '@/components/logistics/machines/MachineDetailsDialog';

export default function Machines() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<MachineStatus | "">("");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { machines, stats, loading, error, refetch, updateMachine, deleteMachine } = useMachines();

  const filteredMachines = machines.filter((machine) => {
    const searchMatch =
      machine.serial_number.toLowerCase().includes(search.toLowerCase()) ||
      machine.model.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter ? machine.status === statusFilter : true;
    return searchMatch && statusMatch;
  });

  const handleStatusFilter = (status: MachineStatus | "") => {
    setStatusFilter(status);
  };

  const handleOpenDetails = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsDetailsOpen(true);
  };

  const handleUpdateMachine = async (id: string, updates: Partial<Machine>) => {
    try {
      await updateMachine(id, updates);
      refetch();
    } catch (error) {
      console.error('Error updating machine:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Máquinas</h1>
        <Input
          type="search"
          placeholder="Buscar por série ou modelo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Tabs defaultValue="all" className="mb-4">
        <TabsList>
          <TabsTrigger value="all" onClick={() => handleStatusFilter("")}>
            Todas ({stats.total})
          </TabsTrigger>
          <TabsTrigger value={MachineStatus.ACTIVE} onClick={() => handleStatusFilter(MachineStatus.ACTIVE)}>
            Ativas ({stats.active})
          </TabsTrigger>
          <TabsTrigger value={MachineStatus.INACTIVE} onClick={() => handleStatusFilter(MachineStatus.INACTIVE)}>
            Inativas ({stats.inactive})
          </TabsTrigger>
          <TabsTrigger value={MachineStatus.MAINTENANCE} onClick={() => handleStatusFilter(MachineStatus.MAINTENANCE)}>
            Manutenção ({stats.maintenance})
          </TabsTrigger>
          <TabsTrigger value={MachineStatus.BLOCKED} onClick={() => handleStatusFilter(MachineStatus.BLOCKED)}>
            Bloqueadas ({stats.blocked})
          </TabsTrigger>
          <TabsTrigger value={MachineStatus.STOCK} onClick={() => handleStatusFilter(MachineStatus.STOCK)}>
            Em Estoque ({stats.stock})
          </TabsTrigger>
           <TabsTrigger value={MachineStatus.TRANSIT} onClick={() => handleStatusFilter(MachineStatus.TRANSIT)}>
            Em Trânsito ({stats.transit})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" />
        <TabsContent value={MachineStatus.ACTIVE} />
        <TabsContent value={MachineStatus.INACTIVE} />
        <TabsContent value={MachineStatus.MAINTENANCE} />
        <TabsContent value={MachineStatus.BLOCKED} />
        <TabsContent value={MachineStatus.STOCK} />
        <TabsContent value={MachineStatus.TRANSIT} />
      </Tabs>
      
      <Table>
        <TableCaption>Lista de máquinas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Série</TableHead>
            <TableHead>Modelo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Carregando...</TableCell>
            </TableRow>
          )}
          {error && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-red-500">{error}</TableCell>
            </TableRow>
          )}
          {filteredMachines.map((machine) => (
            <TableRow key={machine.id}>
              <TableCell>{machine.serial_number}</TableCell>
              <TableCell>{machine.model}</TableCell>
              <TableCell>
                <Badge variant="secondary">{machine.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleOpenDetails(machine)}>
                      Ver Detalhes
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => console.log("Editar")}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500" onClick={() => console.log("Excluir")}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total de máquinas: {stats.total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      
      <MachineDetailsDialog
        machine={selectedMachine}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={handleUpdateMachine}
        onDelete={deleteMachine}
      />
    </div>
  );
}
