
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useShipments } from "@/hooks/use-shipments";
import { Shipment } from "@/types/shipment.types";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const ShipmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { shipments, isLoading, updateShipment, deleteShipment } = useShipments();
  
  const getStatusBadge = (status: Shipment['status']) => {
    const statusConfig = {
      pending: { label: "Pendente", variant: "secondary" as const },
      in_transit: { label: "Em Trânsito", variant: "default" as const },
      delivered: { label: "Entregue", variant: "default" as const },
      cancelled: { label: "Cancelado", variant: "destructive" as const }
    };

    const config = statusConfig[status];
    return (
      <Badge 
        variant={config.variant}
        className={
          status === "delivered" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
          status === "in_transit" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
          ""
        }
      >
        {config.label}
      </Badge>
    );
  };

  const getItemTypeBadge = (type: Shipment['item_type']) => {
    const typeConfig = {
      machine: { label: "Máquina", color: "bg-purple-50 text-purple-700 border-purple-200" },
      bobina: { label: "Bobina", color: "bg-orange-50 text-orange-700 border-orange-200" },
      other: { label: "Outro", color: "bg-gray-50 text-gray-700 border-gray-200" }
    };

    const config = typeConfig[type];
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = async (shipmentId: string, newStatus: Shipment['status']) => {
    await updateShipment(shipmentId, { status: newStatus });
  };

  const handleDelete = async (shipmentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este envio?')) {
      await deleteShipment(shipmentId);
    }
  };

  const columns: ColumnDef<Shipment>[] = [
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.client?.business_name || 'N/A'}</div>
      ),
    },
    {
      id: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="space-y-1">
          {getItemTypeBadge(row.original.item_type)}
          <div className="text-sm text-muted-foreground">
            {row.original.item_description}
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: "dates",
      header: "Datas",
      cell: ({ row }) => (
        <div className="text-sm">
          <div>Criado: {format(new Date(row.original.created_at), "dd/MM/yyyy", { locale: ptBR })}</div>
          {row.original.delivered_at && (
            <div className="text-muted-foreground">
              Entregue: {format(new Date(row.original.delivered_at), "dd/MM/yyyy", { locale: ptBR })}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "responsible",
      header: "Responsável",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.creator?.name || 'N/A'}</div>
      ),
    },
    {
      id: "delivery",
      header: "Data de Entrega",
      cell: ({ row }) => (
        <div className="text-sm font-mono">
          {row.original.delivery_date 
            ? format(new Date(row.original.delivery_date), "dd/MM/yyyy", { locale: ptBR })
            : "Não definida"
          }
        </div>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            {row.original.status !== 'delivered' && (
              <DropdownMenuItem 
                onClick={() => handleStatusChange(row.original.id, 'delivered')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Marcar como Entregue
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === "" || 
      shipment.client?.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.item_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-muted animate-pulse rounded" />
          <div className="h-10 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="in_transit">Em Trânsito</SelectItem>
            <SelectItem value="delivered">Entregue</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredShipments}
      />
    </div>
  );
};

export default ShipmentsList;
