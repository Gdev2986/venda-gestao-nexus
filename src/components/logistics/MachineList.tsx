
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import MachineFormModal from "./MachineFormModal";
import { useMachines } from "@/hooks/use-machines";

const MachineList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const { machines, isLoading, currentPage, totalPages, onPageChange, refreshMachines } = useMachines({ searchTerm, statusFilter });
  
  const columns = [
    {
      id: "serialNumber",
      header: "ID/Serial",
      accessorKey: "serialNumber",
    },
    {
      id: "model",
      header: "Modelo",
      accessorKey: "model",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full mr-2 ${
                status === "ACTIVE"
                  ? "bg-green-500"
                  : status === "MAINTENANCE"
                  ? "bg-amber-500"
                  : status === "INACTIVE"
                  ? "bg-gray-500"
                  : "bg-red-500"
              }`}
            />
            <span>
              {status === "ACTIVE"
                ? "Operando"
                : status === "MAINTENANCE"
                ? "Manutenção"
                : status === "INACTIVE"
                ? "Parada"
                : "Troca Solicitada"}
            </span>
          </div>
        );
      },
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "clientName",
    },
    {
      id: "createdAt",
      header: "Data de Entrada",
      accessorKey: "createdAt",
      cell: ({ row }: any) => {
        return new Date(row.original.createdAt).toLocaleDateString("pt-BR");
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Editar
          </Button>
          <Button variant="outline" size="sm">
            Ver Detalhes
          </Button>
        </div>
      ),
    },
  ];

  const handleAddMachine = (machine: any) => {
    setShowForm(false);
    refreshMachines();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Máquinas</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nova Máquina
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, modelo, cliente..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="ACTIVE">Operando</SelectItem>
              <SelectItem value="MAINTENANCE">Em Manutenção</SelectItem>
              <SelectItem value="INACTIVE">Paradas</SelectItem>
              <SelectItem value="REPLACEMENT_REQUESTED">Troca Solicitada</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={machines}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
      
      {showForm && (
        <MachineFormModal
          open={showForm}
          onOpenChange={setShowForm}
          onSave={handleAddMachine}
        />
      )}
    </div>
  );
};

export default MachineList;
