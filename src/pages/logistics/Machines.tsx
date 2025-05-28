
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Search, MoreVertical, FileText, Trash2 } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import CreateMachineDialog from "@/components/logistics/modals/CreateMachineDialog";
import { MachineDetailsDialog } from "@/components/logistics/machines/MachineDetailsDialog";
import { MachineDeleteDialog } from "@/components/logistics/machines/MachineDeleteDialog";
import { useMachines } from "@/hooks/logistics/use-machines";
import { Machine, MachineStatus } from "@/types/machine.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const LogisticsMachines = () => {
  const navigate = useNavigate();
  const createMachineDialog = useDialog();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsMode, setDetailsMode] = useState<'view' | 'edit'>('view');
  
  const { machines, isLoading, fetchMachines } = useMachines({
    enableRealtime: true,
    initialFetch: true,
  });
  
  // Filter machines based on search and status
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = !searchTerm || 
      machine.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !statusFilter || machine.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredMachines.length / itemsPerPage));
  const paginatedMachines = filteredMachines.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const handleCreateMachineSuccess = () => {
    fetchMachines();
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleViewDetails = (machine: Machine) => {
    setSelectedMachine(machine);
    setDetailsMode('view');
    setDetailsDialogOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setDetailsMode('edit');
    setDetailsDialogOpen(true);
  };

  const handleDeleteMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setDeleteDialogOpen(true);
  };

  const handleMachineUpdate = () => {
    fetchMachines();
    setDetailsDialogOpen(false);
  };

  const handleMachineDelete = () => {
    fetchMachines();
    setDeleteDialogOpen(false);
  };
  
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

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Gestão de Máquinas"
        description="Gerencie o estoque, instalações e manutenção de máquinas"
        action={
          <Button onClick={createMachineDialog.open}>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Máquina
          </Button>
        }
      />
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número de série, modelo ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 max-w-xs"
          />
        </div>
        <div>
          <Select
            value={statusFilter || "all"}
            onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todos os Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="STOCK">Em Estoque</SelectItem>
              <SelectItem value="ACTIVE">Operando</SelectItem>
              <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
              <SelectItem value="INACTIVE">Inativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Série</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array(itemsPerPage).fill(0).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : paginatedMachines.length > 0 ? (
                paginatedMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      {getStatusBadge(machine.status as MachineStatus)}
                    </TableCell>
                    <TableCell>{machine.client?.business_name || "Não Vinculada"}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {machine.notes || "-"}
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
                          <DropdownMenuItem onClick={() => handleViewDetails(machine)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditMachine(machine)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteMachine(machine)}
                            className="text-red-600 focus:text-red-700"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhuma máquina encontrada. Registre uma nova máquina.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {!isLoading && filteredMachines.length > itemsPerPage && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <PaginationItem key={page}>
                <PaginationLink 
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <CreateMachineDialog 
        open={createMachineDialog.isOpen}
        onOpenChange={createMachineDialog.close}
        onSuccess={handleCreateMachineSuccess}
      />

      <MachineDetailsDialog
        machine={selectedMachine}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onUpdate={handleMachineUpdate}
        mode={detailsMode}
      />

      <MachineDeleteDialog
        machine={selectedMachine}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleMachineDelete}
      />
    </div>
  );
};

export default LogisticsMachines;
