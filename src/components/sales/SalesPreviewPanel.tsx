
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface SalesPreviewPanelProps {
  sales: NormalizedSale[];
  title?: string;
}

const SalesPreviewPanel = ({ sales, title = "Dados de Vendas" }: SalesPreviewPanelProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate pagination
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = sales.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Reset to first page when sales data changes
  useState(() => {
    setCurrentPage(1);
  }, [sales]);

  const formatDate = (date: string | Date) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {title}
          <span className="text-sm font-normal text-muted-foreground">
            {sales.length} registros
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum dado encontrado
          </div>
        ) : (
          <>
            <div className="rounded-md border">
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSales.map((sale, index) => (
                    <TableRow key={sale.id || index}>
                      <TableCell>{sale.status}</TableCell>
                      <TableCell>{sale.payment_type}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(sale.gross_amount)}
                      </TableCell>
                      <TableCell>{formatDate(sale.transaction_date)}</TableCell>
                      <TableCell>{sale.installments}x</TableCell>
                      <TableCell>{sale.terminal}</TableCell>
                      <TableCell>{sale.brand}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} até {Math.min(endIndex, sales.length)} de {sales.length} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
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
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
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

export default SalesPreviewPanel;
