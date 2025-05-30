import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Search, MapPin, Phone, Mail, Package } from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { useShipments } from "@/hooks/use-shipments";

interface ClientWithShipmentCount {
  id: string;
  business_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  status?: string; // Tornado opcional para compatibilidade
  shipmentCount: number;
}

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { clients, loading: clientsLoading } = useClients();
  const { shipments, isLoading: shipmentsLoading } = useShipments();

  // Combine clients with shipment counts
  const clientsWithShipments: ClientWithShipmentCount[] = clients?.map(client => {
    const shipmentCount = shipments.filter(shipment => shipment.client_id === client.id).length;
    return {
      ...client,
      shipmentCount
    };
  }) || [];

  const columns: ColumnDef<ClientWithShipmentCount>[] = [
    {
      id: "business",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.business_name}</div>
          {row.original.contact_name && (
            <div className="text-sm text-muted-foreground">
              Contato: {row.original.contact_name}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contato",
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          {row.original.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-3 w-3 text-muted-foreground" />
              {row.original.email}
            </div>
          )}
          {row.original.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-3 w-3 text-muted-foreground" />
              {row.original.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "address",
      header: "Endereço",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
              <div>
                <div>{row.original.address}</div>
                {(row.original.city || row.original.state || row.original.zip) && (
                  <div className="text-muted-foreground">
                    {[row.original.city, row.original.state, row.original.zip]
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      id: "shipments",
      header: "Envios",
      cell: ({ row }) => (
        <div className="text-center">
          <div className="flex items-center gap-2 justify-center">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.shipmentCount}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Total de envios
          </div>
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.status === 'ACTIVE' ? 'default' : 'secondary'}
          className={
            row.original.status === 'ACTIVE' 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : ""
          }
        >
          {row.original.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => (
        <Button variant="outline" size="sm">
          Ver Histórico
        </Button>
      ),
    }
  ];

  const filteredClients = clientsWithShipments.filter(client => {
    return searchTerm === "" || 
      client.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (clientsLoading || shipmentsLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes por nome, empresa, email ou cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable 
        columns={columns} 
        data={filteredClients}
      />
    </div>
  );
};

export default ClientsList;
