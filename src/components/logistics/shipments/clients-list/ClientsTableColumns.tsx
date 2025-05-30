
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Package } from "lucide-react";

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
  status?: string;
  shipmentCount: number;
}

interface ClientsTableColumnsProps {
  onViewHistory: (clientId: string, clientName: string) => void;
}

export const useClientsTableColumns = ({ onViewHistory }: ClientsTableColumnsProps): ColumnDef<ClientWithShipmentCount>[] => {
  return [
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
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewHistory(row.original.id, row.original.business_name)}
        >
          Ver Histórico
        </Button>
      ),
    }
  ];
};

export type { ClientWithShipmentCount };
