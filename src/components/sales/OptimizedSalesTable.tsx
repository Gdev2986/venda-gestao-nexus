
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
import { PaymentTypeBadge } from "@/components/sales/PaymentTypeBadge";
import { memo } from "react";

interface OptimizedSalesTableProps {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

const OptimizedSalesTable = memo(({ 
  sales, 
  totalCount, 
  totalPages, 
  currentPage, 
  isLoading,
  onPageChange 
}: OptimizedSalesTableProps) => {
  
  // Calcular totais da página atual
  const currentPageTotal = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);

  // Render status badge with dark theme support
  const renderStatusBadge = (status: string) => {
    let badgeClass = "bg-gray-500 hover:bg-gray-600 text-white border-gray-500";
    
    if (status.toLowerCase() === "aprovada" || status.toLowerCase() === "approved") {
      badgeClass = "bg-green-600 hover:bg-green-700 text-white border-green-600";
    } else if (
      status.toLowerCase() === "rejeitada" || 
      status.toLowerCase() === "rejected" || 
      status.toLowerCase() === "denied"
    ) {
      badgeClass = "bg-red-600 hover:bg-red-700 text-white border-red-600";
    } else if (
      status.toLowerCase() === "pendente" || 
      status.toLowerCase() === "pending"
    ) {
      badgeClass = "bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600";
    }
    
    return <Badge variant="default" className={badgeClass}>{status}</Badge>;
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

  // Handler for page change with optimized loading
  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    console.log(`Mudando da página ${currentPage} para a página ${page} (sem reload completo)`);
    onPageChange(page);
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
                : `${totalCount.toLocaleString('pt-BR')} registros encontrados • Página ${currentPage} de ${totalPages}`}
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
                    <TableHead className="text-center">Parcelas</TableHead>
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
                        <TableCell>
                          <PaymentTypeBadge 
                            paymentType={sale.payment_type} 
                            installments={sale.installments} 
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(sale.gross_amount)}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {typeof sale.transaction_date === 'string' ? 
                            sale.transaction_date : 
                            sale.transaction_date.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="font-mono">
                            {sale.installments}x
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{sale.terminal}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{sale.brand}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.source}</Badge>
                        </TableCell>
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
            
            {/* Paginação Otimizada */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {((currentPage - 1) * 10) + 1} a {Math.min(currentPage * 10, totalCount)} de {totalCount.toLocaleString('pt-BR')} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1 || isLoading}
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
                          onClick={() => handlePageChange(1)}
                          className="w-9 h-9"
                          disabled={isLoading}
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
                        onClick={() => handlePageChange(pageNumber)}
                        className="w-9 h-9"
                        disabled={isLoading}
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
                          onClick={() => handlePageChange(totalPages)}
                          className="w-9 h-9"
                          disabled={isLoading}
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || isLoading}
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
});

OptimizedSalesTable.displayName = "OptimizedSalesTable";

export default OptimizedSalesTable;
