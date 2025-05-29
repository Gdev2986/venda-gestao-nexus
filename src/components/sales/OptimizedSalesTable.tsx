
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";

interface OptimizedSalesTableProps {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const OptimizedSalesTable = ({ 
  sales, 
  totalCount, 
  totalPages, 
  currentPage, 
  isLoading,
  onPageChange 
}: OptimizedSalesTableProps) => {
  
  // Calcular totais da página atual
  const currentPageTotal = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let variant: "default" | "outline" | "secondary" | "destructive" = "outline";
    
    if (status.toLowerCase() === "aprovada" || status.toLowerCase() === "approved") {
      variant = "default";
    } else if (
      status.toLowerCase() === "rejeitada" || 
      status.toLowerCase() === "rejected" || 
      status.toLowerCase() === "denied"
    ) {
      variant = "destructive";
    } else if (
      status.toLowerCase() === "pendente" || 
      status.toLowerCase() === "pending"
    ) {
      variant = "secondary";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  // Gerar números de página para exibição
  const getPageNumbers = () => {
    const delta = 2; // Mostrar 2 páginas antes e depois da atual
    const pages = [];
    
    for (let i = Math.max(1, currentPage - delta); 
         i <= Math.min(totalPages, currentPage + delta); 
         i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle>Vendas Otimizadas</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isLoading 
                ? "Carregando..." 
                : `${totalCount} registros encontrados • Página ${currentPage} de ${totalPages}`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col sm:items-center">
              <span className="font-medium">Total desta página:</span>
              <span className="text-foreground font-bold">
                {formatCurrency(currentPageTotal)}
              </span>
            </div>
            
            <div className="flex flex-col sm:items-center">
              <span className="font-medium">Registros por página:</span>
              <span className="text-foreground font-bold">
                {sales.length}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-muted/40 w-full h-12 animate-pulse rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo de Pagamento</TableHead>
                    <TableHead className="text-right">Valor Bruto</TableHead>
                    <TableHead>Data de Transação</TableHead>
                    <TableHead>Parcelas</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Bandeira</TableHead>
                    <TableHead>Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length > 0 ? (
                    sales.map((sale, index) => (
                      <TableRow key={sale.id || index}>
                        <TableCell>{renderStatusBadge(sale.status)}</TableCell>
                        <TableCell>{sale.payment_type}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(sale.gross_amount)}
                        </TableCell>
                        <TableCell>{typeof sale.transaction_date === 'string' ? 
                          sale.transaction_date : 
                          sale.transaction_date.toLocaleString()}</TableCell>
                        <TableCell>{sale.installments}</TableCell>
                        <TableCell>{sale.terminal}</TableCell>
                        <TableCell>{sale.brand}</TableCell>
                        <TableCell>{sale.source}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhum dado encontrado para os filtros aplicados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * 1000) + 1} a {Math.min(currentPage * 1000, totalCount)} de {totalCount} registros
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
                    {currentPage > 3 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(1)}
                          className="w-9 h-9"
                        >
                          1
                        </Button>
                        {currentPage > 4 && <span className="text-muted-foreground">...</span>}
                      </>
                    )}
                    
                    {getPageNumbers().map((pageNumber) => (
                      <Button
                        key={pageNumber}
                        variant={pageNumber === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNumber)}
                        className="w-9 h-9"
                      >
                        {pageNumber}
                      </Button>
                    ))}
                    
                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="text-muted-foreground">...</span>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(totalPages)}
                          className="w-9 h-9"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
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
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizedSalesTable;
