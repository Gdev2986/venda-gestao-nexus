
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { NormalizedSale } from "@/utils/sales-processor";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

interface SalesPreviewPanelProps {
  sales: NormalizedSale[];
  title: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  totalCount?: number;
  isLoading?: boolean;
}

export const SalesPreviewPanel = ({ 
  sales, 
  title,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalCount,
  isLoading = false
}: SalesPreviewPanelProps) => {
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

  // Helper function to format date consistently
  const formatTransactionDate = (dateValue: string | Date | null | undefined): string => {
    if (!dateValue) return 'N/A';
    
    if (typeof dateValue === 'string') {
      return dateValue;
    }
    
    if (dateValue instanceof Date) {
      return dateValue.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    
    return String(dateValue);
  };

  // Table columns identical to admin side
  const columns: ColumnDef<NormalizedSale>[] = [
    {
      id: "transaction_date",
      header: "Data/Hora",
      cell: ({ row }) => {
        const formattedDate = formatTransactionDate(row.original.transaction_date);
        return (
          <span className="font-medium text-sm">
            {formattedDate}
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
              {title}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {totalCount || filteredSales.length} transações encontradas
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
        
        {/* Paginação customizada para dados otimizados */}
        {onPageChange && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} 
              {totalCount && ` - ${totalCount.toLocaleString('pt-BR')} registros totais`}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(pageNumber)}
                      className="w-9 h-9"
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                Próxima
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPreviewPanel;
