
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types";
import { NormalizedSale } from "@/utils/sales-processor";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface ClientSalesTableProps {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export const ClientSalesTable = ({ 
  sales, 
  totalCount,
  totalPages,
  currentPage,
  isLoading = false,
  onPageChange
}: ClientSalesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Payment method badge function identical to admin side
  const getPaymentMethodBadge = (method: string, installments?: number) => {
    switch (method) {
      case 'CREDIT':
      case 'Cartão de Crédito':
        const installmentText = installments && installments > 1 ? ` ${installments}x` : " À Vista";
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
            Crédito{installmentText}
          </Badge>
        );
      case 'DEBIT':
      case 'Cartão de Débito':
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            Débito
          </Badge>
        );
      case 'PIX':
      case 'Pix':
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">
            PIX
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">
            {method}
          </Badge>
        );
    }
  };

  // Table columns identical to admin side
  const columns: ColumnDef<NormalizedSale>[] = [
    {
      id: "transaction_date",
      header: "Data/Hora",
      cell: ({ row }) => {
        const dateStr = row.original.transaction_date;
        return (
          <span className="font-medium text-sm">
            {dateStr}
          </span>
        );
      }
    },
    {
      id: "id",
      header: "Código",
      cell: ({ row }) => (
        <span className="font-mono text-sm">
          {row.original.id?.substring(0, 8) || 'N/A'}
        </span>
      )
    },
    {
      id: "terminal",
      header: "Terminal", 
      cell: ({ row }) => (
        <span className="text-sm">
          {row.original.terminal}
        </span>
      )
    },
    {
      id: "gross_amount",
      header: "Valor Bruto",
      cell: ({ row }) => (
        <span className="font-medium text-right">
          {row.original.formatted_amount}
        </span>
      )
    },
    {
      id: "payment_type",
      header: "Pagamento",
      cell: ({ row }) => (
        <div className="text-center">
          {getPaymentMethodBadge(row.original.payment_type, row.original.installments)}
        </div>
      )
    }
  ];

  // Filter sales by search term
  const filteredSales = sales.filter(sale =>
    sale.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.terminal?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-emerald-600" />
              Vendas Detalhadas
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount} transações encontradas
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou terminal..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={filteredSales}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};
