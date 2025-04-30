
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const columns = [
  {
    id: "date",
    header: "Data",
    accessorKey: "date",
    cell: (info: any) => {
      const dateValue = info.date;
      if (!dateValue) return "N/A";
      return format(new Date(dateValue), "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "amount",
    header: "Valor",
    accessorKey: "amount",
    cell: (info: any) => {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(info.amount || 0);
    },
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    cell: (info: any) => {
      const status = info.status;
      
      if (status === "pending") {
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pendente</Badge>;
      }
      
      if (status === "completed") {
        return <Badge variant="outline" className="border-green-500 text-green-500">Completo</Badge>;
      }
      
      return <Badge variant="outline">{status}</Badge>;
    },
  },
];
