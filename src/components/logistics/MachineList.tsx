import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Edit, Copy, Trash2, ArrowRight, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useDialog } from "@/hooks/use-dialog";
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import MachineTransferDialog from "@/components/logistics/machine-dialogs/MachineTransferDialog";
import { Machine } from "@/types";

interface MachineListProps {
  searchTerm: string;
  modelFilter: string;
  statusFilter: string;
  onSearchChange: (term: string) => void;
  onModelFilterChange: (model: string) => void;
  onStatusFilterChange: (status: string) => void;
  onAddNewClick: () => void;
}

const MachineList: React.FC<MachineListProps> = ({
  searchTerm,
  modelFilter,
  statusFilter,
  onSearchChange,
  onModelFilterChange,
  onStatusFilterChange,
  onAddNewClick
}) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [transferDialogIsOpen, setTransferDialogIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const { toast } = useToast();
  const editMachineDialog = useDialog();
  const deleteMachineDialog = useDialog();
  const duplicateMachineDialog = useDialog();

  const handleOpenTransferDialog = (machine: Machine) => {
    setSelectedMachine(machine);
    setTransferDialogIsOpen(true);
  };

  const handleCloseTransferDialog = () => {
    setTransferDialogIsOpen(false);
    setSelectedMachine(null);
  };

  const handleRefreshData = () => {
    fetchMachines();
  };

  const fetchMachines = useCallback(async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockMachines: Machine[] = [
        { id: "1", serial_number: "SN001", model: "Model A", status: "Active", client_id: "cx1", location: "Warehouse", created_at: "2023-01-01", name: "Machine 1", client_name: "Client X" },
        { id: "2", serial_number: "SN002", model: "Model B", status: "Inactive", client_id: undefined, location: "Client Site", created_at: "2023-02-01", name: "Machine 2", client_name: undefined },
        { id: "3", serial_number: "SN003", model: "Model A", status: "Active", client_id: "cy1", location: "Warehouse", created_at: "2023-03-01", name: "Machine 3", client_name: "Client Y" },
        { id: "4", serial_number: "SN004", model: "Model C", status: "Active", client_id: "cz1", location: "Client Site", created_at: "2023-04-01", name: "Machine 4", client_name: "Client Z" },
        { id: "5", serial_number: "SN005", model: "Model B", status: "Inactive", client_id: undefined, location: "Warehouse", created_at: "2023-05-01", name: "Machine 5", client_name: undefined },
        { id: "6", serial_number: "SN006", model: "Model A", status: "Active", client_id: "cx2", location: "Client Site", created_at: "2023-06-01", name: "Machine 6", client_name: "Client X" },
        { id: "7", serial_number: "SN007", model: "Model C", status: "Active", client_id: "cy2", location: "Warehouse", created_at: "2023-07-01", name: "Machine 7", client_name: "Client Y" },
        { id: "8", serial_number: "SN008", model: "Model B", status: "Inactive", client_id: undefined, location: "Client Site", created_at: "2023-08-01", name: "Machine 8", client_name: undefined },
        { id: "9", serial_number: "SN009", model: "Model A", status: "Active", client_id: "cz2", location: "Warehouse", created_at: "2023-09-01", name: "Machine 9", client_name: "Client Z" },
        { id: "10", serial_number: "SN010", model: "Model C", status: "Active", client_id: "cx3", location: "Client Site", created_at: "2023-10-01", name: "Machine 10", client_name: "Client X" },
        { id: "11", serial_number: "SN011", model: "Model B", status: "Inactive", client_id: undefined, location: "Warehouse", created_at: "2023-11-01", name: "Machine 11", client_name: undefined },
        { id: "12", serial_number: "SN012", model: "Model A", status: "Active", client_id: "cy3", location: "Client Site", created_at: "2023-12-01", name: "Machine 12", client_name: "Client Y" },
        { id: "13", serial_number: "SN013", model: "Model C", status: "Active", client_id: "cz3", location: "Warehouse", created_at: "2024-01-01", name: "Machine 13", client_name: "Client Z" },
        { id: "14", serial_number: "SN014", model: "Model B", status: "Inactive", client_id: undefined, location: "Client Site", created_at: "2024-02-01", name: "Machine 14", client_name: undefined },
        { id: "15", serial_number: "SN015", model: "Model A", status: "Active", client_id: "cx4", location: "Warehouse", created_at: "2024-03-01", name: "Machine 15", client_name: "Client X" },
        { id: "16", serial_number: "SN016", model: "Model C", status: "Active", client_id: "cy4", location: "Client Site", created_at: "2024-04-01", name: "Machine 16", client_name: "Client Y" },
        { id: "17", serial_number: "SN017", model: "Model B", status: "Inactive", client_id: undefined, location: "Warehouse", created_at: "2024-05-01", name: "Machine 17", client_name: undefined },
        { id: "18", serial_number: "SN018", model: "Model A", status: "Active", client_id: "cz4", location: "Client Site", created_at: "2024-06-01", name: "Machine 18", client_name: "Client Z" },
        { id: "19", serial_number: "SN019", model: "Model C", status: "Active", client_id: "cx5", location: "Warehouse", created_at: "2024-07-01", name: "Machine 19", client_name: "Client X" },
        { id: "20", serial_number: "SN020", model: "Model B", status: "Inactive", client_id: undefined, location: "Client Site", created_at: "2024-08-01", name: "Machine 20", client_name: undefined },
      ];

      // Apply filters
      let filteredMachines = mockMachines.filter(machine => {
        const searchRegex = new RegExp(searchTerm, 'i');
        const modelMatch = modelFilter ? machine.model === modelFilter : true;
        const statusMatch = statusFilter ? machine.status === statusFilter : true;
        const searchMatch = searchRegex.test(machine.serial_number) || searchRegex.test(machine.model) || (machine.name ? searchRegex.test(machine.name) : false) || (machine.client_name ? searchRegex.test(machine.client_name) : false);

        return modelMatch && statusMatch && searchMatch;
      });

      setTotalItems(filteredMachines.length);

      // Apply pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedMachines = filteredMachines.slice(startIndex, startIndex + itemsPerPage);

      setMachines(paginatedMachines);
      setIsLoading(false);
    }, 500);
  }, [searchTerm, modelFilter, statusFilter, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchMachines();
  }, [fetchMachines]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Card className="h-full">
      <CardContent className="relative h-full overflow-hidden">
        <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between">
          <Input
            placeholder="Buscar máquinas..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <Button size="sm" onClick={onAddNewClick}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Button>
        </div>

        <ScrollArea className="absolute top-16 left-0 right-0 bottom-0 py-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Número de Série</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Última Manutenção</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Display skeleton rows while loading
                [...Array(itemsPerPage)].map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell className="text-right"><Skeleton /></TableCell>
                  </TableRow>
                ))
              ) : machines.length > 0 ? (
                // Display machine data rows
                machines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">{machine.serial_number}</TableCell>
                    <TableCell>{machine.model}</TableCell>
                    <TableCell>
                      {machine.status === "Active" ? (
                        <Badge variant="outline">Ativa</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-500 border-gray-200">Inativa</Badge>
                      )}
                    </TableCell>
                    <TableCell>{machine.client_name || "N/A"}</TableCell>
                    <TableCell>{machine.location}</TableCell>
                    <TableCell>N/A</TableCell>
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
                          <DropdownMenuItem onClick={() => editMachineDialog.open()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateMachineDialog.open()}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteMachineDialog.open()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Deletar
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
                // Display message when no machines are found
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Nenhuma máquina encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>

        {machines.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 z-10">
            <div className="flex justify-center">
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <PaginationPrevious className="h-4 w-4" />
                </Button>
                {/* Display page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "pointer-events-none" : ""}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                >
                  <PaginationNext className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

      {selectedMachine && (
        <MachineTransferDialog
          open={transferDialogIsOpen} 
          onOpenChange={handleCloseTransferDialog}
          machineId={selectedMachine.id}
          machineName={selectedMachine.name || selectedMachine.serial_number}
          onTransferComplete={handleRefreshData}
        />
      )}
      </CardContent>
    </Card>
  );
};

export default MachineList;
