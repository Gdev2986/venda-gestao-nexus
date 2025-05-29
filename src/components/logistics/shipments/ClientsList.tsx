
import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Search, MapPin, Phone, Mail, Package } from "lucide-react";

interface ClientInfo {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  totalShipments: number;
  lastShipmentDate?: Date;
  status: 'active' | 'inactive';
}

const ClientsList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const clients: ClientInfo[] = [
    {
      id: "1",
      businessName: "Empresa ABC Ltda",
      contactName: "João da Silva",
      email: "joao@empresaabc.com",
      phone: "(11) 99999-9999",
      address: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      totalShipments: 15,
      lastShipmentDate: new Date("2024-05-27"),
      status: "active"
    },
    {
      id: "2",
      businessName: "Comércio XYZ",
      contactName: "Maria Santos",
      email: "maria@comercioxyz.com",
      phone: "(11) 88888-8888",
      address: "Av. Principal, 456",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "20000-000",
      totalShipments: 8,
      lastShipmentDate: new Date("2024-05-26"),
      status: "active"
    },
    {
      id: "3",
      businessName: "Loja 123",
      contactName: "Carlos Lima",
      email: "carlos@loja123.com",
      phone: "(11) 77777-7777",
      address: "Rua do Comércio, 789",
      city: "Belo Horizonte",
      state: "MG",
      zipCode: "30000-000",
      totalShipments: 3,
      status: "inactive"
    }
  ];

  const columns: ColumnDef<ClientInfo>[] = [
    {
      id: "business",
      header: "Empresa",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.businessName}</div>
          <div className="text-sm text-muted-foreground">
            Contato: {row.original.contactName}
          </div>
        </div>
      ),
    },
    {
      id: "contact",
      header: "Contato",
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {row.original.email}
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            {row.original.phone}
          </div>
        </div>
      ),
    },
    {
      id: "address",
      header: "Endereço",
      cell: ({ row }) => (
        <div className="text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
            <div>
              <div>{row.original.address}</div>
              <div className="text-muted-foreground">
                {row.original.city}, {row.original.state} - {row.original.zipCode}
              </div>
            </div>
          </div>
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
            <span className="font-medium">{row.original.totalShipments}</span>
          </div>
          {row.original.lastShipmentDate && (
            <div className="text-xs text-muted-foreground mt-1">
              Último: {row.original.lastShipmentDate.toLocaleDateString('pt-BR')}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant={row.original.status === 'active' ? 'default' : 'secondary'}
          className={
            row.original.status === 'active' 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : ""
          }
        >
          {row.original.status === 'active' ? 'Ativo' : 'Inativo'}
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

  const filteredClients = clients.filter(client => {
    return searchTerm === "" || 
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
