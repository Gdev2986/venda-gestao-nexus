
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import ServiceFormModal from "./ServiceFormModal";
import { useServices } from "@/hooks/use-services";

const ServiceList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  
  const { services, isLoading, currentPage, totalPages, onPageChange, refreshServices } = 
    useServices({ searchTerm, statusFilter, typeFilter });
  
  const columns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      cell: ({ row }: any) => {
        return row.original.id.substring(0, 8) + "...";
      },
    },
    {
      id: "client",
      header: "Cliente",
      accessorKey: "clientName",
    },
    {
      id: "establishment",
      header: "Estabelecimento",
      accessorKey: "establishment",
    },
    {
      id: "machine",
      header: "Máquina",
      accessorKey: "machineSerial",
    },
    {
      id: "type",
      header: "Tipo de Atendimento",
      cell: ({ row }: any) => {
        const type = row.original.type;
        return (
          <span>
            {type === "MAINTENANCE"
              ? "Manutenção"
              : type === "PAPER_REPLACEMENT"
              ? "Troca de Bobina"
              : type === "INSTALLATION"
              ? "Instalação"
              : "Entrega de Bobina"}
          </span>
        );
      },
    },
    {
      id: "scheduledFor",
      header: "Data/Hora",
      cell: ({ row }: any) => {
        return new Date(row.original.scheduledFor).toLocaleString("pt-BR");
      },
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
                status === "PENDING"
                  ? "bg-amber-500"
                  : status === "IN_PROGRESS"
                  ? "bg-blue-500"
                  : "bg-green-500"
              }`}
            />
            <span>
              {status === "PENDING"
                ? "Pendente"
                : status === "IN_PROGRESS"
                ? "Em Andamento"
                : "Concluído"}
            </span>
          </div>
        );
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

  const handleAddService = (service: any) => {
    setShowForm(false);
    refreshServices();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Atendimentos</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Atendimento
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente, máquina..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Status</SelectItem>
              <SelectItem value="PENDING">Pendente</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
              <SelectItem value="COMPLETED">Concluído</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={typeFilter}
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo de Atendimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
              <SelectItem value="PAPER_REPLACEMENT">Troca de Bobina</SelectItem>
              <SelectItem value="INSTALLATION">Instalação</SelectItem>
              <SelectItem value="PAPER_DELIVERY">Entrega de Bobina</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filtrar
          </Button>
        </div>
      </div>
      
      <DataTable
        columns={columns}
        data={services}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
      
      {showForm && (
        <ServiceFormModal
          open={showForm}
          onOpenChange={setShowForm}
          onSave={handleAddService}
        />
      )}
    </div>
  );
};

export default ServiceList;
