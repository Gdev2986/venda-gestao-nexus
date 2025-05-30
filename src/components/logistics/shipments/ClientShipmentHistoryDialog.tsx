
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Package, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useShipments } from "@/hooks/use-shipments";
import { Shipment } from "@/types/shipment.types";

interface ClientShipmentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
}

const ClientShipmentHistoryDialog = ({ 
  open, 
  onOpenChange, 
  clientId, 
  clientName 
}: ClientShipmentHistoryDialogProps) => {
  const { shipments, isLoading } = useShipments();

  // Filtrar envios do cliente específico
  const clientShipments = shipments.filter(shipment => shipment.client_id === clientId);

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

  const columns: ColumnDef<Shipment>[] = [
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
      id: "created_date",
      header: "Data de Criação",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
        </div>
      ),
    },
    {
      id: "delivery_date",
      header: "Data de Entrega",
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {row.original.delivery_date 
            ? format(new Date(row.original.delivery_date), "dd/MM/yyyy", { locale: ptBR })
            : "Não definida"
          }
        </div>
      ),
    },
    {
      id: "delivered_at",
      header: "Entregue em",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.delivered_at 
            ? format(new Date(row.original.delivered_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
            : "-"
          }
        </div>
      ),
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Histórico de Envios - {clientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Total de Envios</div>
              <div className="text-2xl font-bold">{clientShipments.length}</div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Entregues</div>
              <div className="text-2xl font-bold text-green-600">
                {clientShipments.filter(s => s.status === 'delivered').length}
              </div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Em Trânsito</div>
              <div className="text-2xl font-bold text-blue-600">
                {clientShipments.filter(s => s.status === 'in_transit').length}
              </div>
            </div>
            <div className="bg-card p-3 rounded-lg border">
              <div className="text-sm text-muted-foreground">Pendentes</div>
              <div className="text-2xl font-bold text-orange-600">
                {clientShipments.filter(s => s.status === 'pending').length}
              </div>
            </div>
          </div>

          {/* Tabela de Envios */}
          {isLoading ? (
            <div className="text-center py-8">
              <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Carregando histórico...</span>
              </div>
            </div>
          ) : clientShipments.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={clientShipments}
            />
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum envio encontrado para este cliente</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientShipmentHistoryDialog;
