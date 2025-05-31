
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { memo, useState } from "react";

interface OptimizedSalesTableProps {
  sales: NormalizedSale[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

const OptimizedSalesTable = memo(({ 
  sales, 
  totalCount, 
  totalPages, 
  currentPage, 
  pageSize,
  isLoading,
  onPageChange,
  onPageSizeChange
}: OptimizedSalesTableProps) => {
  
  const [pageInput, setPageInput] = useState<string>('');
  
  // Calcular totais da página atual
  const currentPageTotal = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);

  // Handler para ir para uma página específica
  const handleGoToPage = () => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setPageInput('');
    }
  };

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
              <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
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
            
            {/* Paginação Otimizada com Input para Página e Seletor de Limite */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 p-4 border-t">
                <div className="text-sm text-muted-foreground text-center">
                  Página {currentPage} de {totalPages} - {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalCount)} de {totalCount.toLocaleString('pt-BR')} registros ({pageSize} por página)
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Input para ir para página específica */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ir para página:</span>
                    <Input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={pageInput}
                      onChange={(e) => setPageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                      className="w-16 h-8 text-center"
                      placeholder={currentPage.toString()}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoToPage}
                      disabled={!pageInput || isLoading}
                      className="h-8"
                    >
                      Ir
                    </Button>
                  </div>

                  {/* Controles de paginação tradicionais */}
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
