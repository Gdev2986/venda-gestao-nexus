
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Calendar, Search, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Shipment {
  id: string;
  clientName: string;
  itemType: 'machine' | 'bobina';
  itemDescription: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryDate?: Date;
  responsibleUser: string;
  trackingCode?: string;
}

const ShipmentsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Mock data
  const shipments: Shipment[] = [
    {
      id: "1",
      clientName: "Empresa ABC Ltda",
      itemType: "machine",
      itemDescription: "Terminal de Pagamento POS-X1",
      status: "delivered",
      createdAt: new Date("2024-05-25"),
      deliveryDate: new Date("2024-05-27"),
      responsibleUser: "João Silva",
      trackingCode: "BR123456789"
    },
    {
      id: "2",
      clientName: "Comércio XYZ",
      itemType: "bobina",
      itemDescription: "Bobina Térmica 80mm x 40m",
      status: "in_transit",
      createdAt: new Date("2024-05-26"),
      responsibleUser: "Maria Santos",
      trackingCode: "BR987654321"
    },
    {
      id: "3",
      clientName: "Loja 123",
      itemType: "machine",
      itemDescription: "Terminal de Pagamento POS-Y2",
      status: "pending",
      createdAt: new Date("2024-05-28"),
      responsibleUser: "Carlos Lima"
    }
  ];

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

  const getItemTypeBadge = (type: Shipment['itemType']) => {
    return type === 'machine' ? (
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        Máquina
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        Bobina
      </Badge>
    );
  };

  const columns: ColumnDef<Shipment>[] = [
    {
      id: "client",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.clientName}</div>
      ),
    },
    {
      id: "item",
      header: "Item",
      cell: ({ row }) => (
        <div className="space-y-1">
          {getItemTypeBadge(row.original.itemType)}
          <div className="text-sm text-muted-foreground">
            {row.original.itemDescription}
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
          <div>Criado: {format(row.original.createdAt, "dd/MM/yyyy", { locale: ptBR })}</div>
          {row.original.deliveryDate && (
            <div className="text-muted-foreground">
              Entregue: {format(row.original.deliveryDate, "dd/MM/yyyy", { locale: ptBR })}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "responsible",
      header: "Responsável",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.responsibleUser}</div>
      ),
    },
    {
      id: "tracking",
      header: "Rastreamento",
      cell: ({ row }) => (
        <div className="text-sm font-mono">
          {row.original.trackingCode || "N/A"}
        </div>
      ),
    }
  ];

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = searchTerm === "" || 
      shipment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.itemDescription.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || shipment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
