
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getMachines, deleteMachine, updateMachine } from "@/services/machine.service";
import { Machine, MachineStatus } from "@/types/machine.types";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import MachineTransferForm from "@/components/logistics/machines/MachineTransferForm";
import { supabase } from "@/integrations/supabase/client";

export default function MachineRegistrationTable() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openTransferDialog, setOpenTransferDialog] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    loadMachines();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('machines-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'machines' 
      }, () => {
        loadMachines();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadMachines = async () => {
    setIsLoading(true);
    try {
      const data = await getMachines();
      setMachines(data);
    } catch (error) {
      console.error("Error loading machines:", error);
      toast({
        title: "Erro ao carregar máquinas",
        description: "Não foi possível carregar a lista de máquinas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta máquina?")) {
      try {
        await deleteMachine(id);
        setMachines(machines.filter(m => m.id !== id));
        toast({
          title: "Máquina excluída com sucesso",
          variant: "default",
        });
      } catch (error) {
        console.error("Error deleting machine:", error);
        toast({
          title: "Erro ao excluir máquina",
          description: "Não foi possível excluir a máquina.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (id: string, status: MachineStatus) => {
    try {
      await updateMachine(id, { status });
      setMachines(machines.map(m => m.id === id ? { ...m, status } : m));
      toast({
        title: "Status atualizado com sucesso",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating machine status:", error);
      toast({
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da máquina.",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = (machine: Machine) => {
    setSelectedMachine(machine);
    setOpenTransferDialog(true);
  };

  const getStatusBadge = (status: MachineStatus) => {
    switch (status) {
      case MachineStatus.ACTIVE:
        return <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>;
      case MachineStatus.INACTIVE:
        return <Badge className="bg-red-500 hover:bg-red-600">Inativo</Badge>;
      case MachineStatus.MAINTENANCE:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Manutenção</Badge>;
      case MachineStatus.STOCK:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Estoque</Badge>;
      case MachineStatus.TRANSIT:
        return <Badge className="bg-purple-500 hover:bg-purple-600">Em Trânsito</Badge>;
      case MachineStatus.BLOCKED:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Bloqueado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = 
      machine.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (machine.client?.business_name && machine.client.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || machine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Buscar por número de série, modelo ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="sm:max-w-xs">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value={MachineStatus.ACTIVE}>Ativos</SelectItem>
            <SelectItem value={MachineStatus.INACTIVE}>Inativos</SelectItem>
            <SelectItem value={MachineStatus.MAINTENANCE}>Em Manutenção</SelectItem>
            <SelectItem value={MachineStatus.STOCK}>Em Estoque</SelectItem>
            <SelectItem value={MachineStatus.TRANSIT}>Em Trânsito</SelectItem>
            <SelectItem value={MachineStatus.BLOCKED}>Bloqueados</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número de Série</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">Carregando...</TableCell>
              </TableRow>
            ) : filteredMachines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Nenhuma máquina encontrada. Registre uma nova máquina.
                </TableCell>
              </TableRow>
            ) : (
              filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.serial_number}</TableCell>
                  <TableCell>{machine.model}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={machine.status} 
                      onValueChange={(value) => handleStatusChange(machine.id, value as MachineStatus)}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue>
                          {getStatusBadge(machine.status)}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={MachineStatus.ACTIVE}>
                          <Badge className="bg-green-500 hover:bg-green-600">Ativo</Badge>
                        </SelectItem>
                        <SelectItem value={MachineStatus.INACTIVE}>
                          <Badge className="bg-red-500 hover:bg-red-600">Inativo</Badge>
                        </SelectItem>
                        <SelectItem value={MachineStatus.MAINTENANCE}>
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">Manutenção</Badge>
                        </SelectItem>
                        <SelectItem value={MachineStatus.STOCK}>
                          <Badge className="bg-blue-500 hover:bg-blue-600">Estoque</Badge>
                        </SelectItem>
                        <SelectItem value={MachineStatus.TRANSIT}>
                          <Badge className="bg-purple-500 hover:bg-purple-600">Em Trânsito</Badge>
                        </SelectItem>
                        <SelectItem value={MachineStatus.BLOCKED}>
                          <Badge className="bg-gray-500 hover:bg-gray-600">Bloqueado</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {machine.client ? (
                      <Link 
                        to={`/admin/clients/${machine.client.id}`} 
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-3.5 w-3.5" />
                        {machine.client.business_name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Sem cliente</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTransfer(machine)}
                      >
                        <LinkIcon className="h-4 w-4 mr-1" />
                        {isMobile ? '' : 'Vincular'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600" 
                        onClick={() => handleDelete(machine.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <Dialog open={openTransferDialog} onOpenChange={setOpenTransferDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Máquina</DialogTitle>
            <DialogDescription>
              Vincule esta máquina a um novo cliente ou remova a vinculação atual.
            </DialogDescription>
          </DialogHeader>
          
          {selectedMachine && (
            <MachineTransferForm
              machineId={selectedMachine.id}
              machineName={selectedMachine.serial_number}
              currentClientId={selectedMachine.client_id}
              onCancel={() => setOpenTransferDialog(false)}
              onTransferComplete={() => {
                setOpenTransferDialog(false);
                loadMachines();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
