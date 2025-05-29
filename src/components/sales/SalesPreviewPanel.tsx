import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";

interface SalesPreviewPanelProps {
  sales: NormalizedSale[];
  title?: string;
}

const ITEMS_PER_PAGE = 20;

const SalesPreviewPanel = ({ sales, title = "Dados de Vendas" }: SalesPreviewPanelProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination based on filtered sales
  const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSales = sales.slice(startIndex, endIndex);

  // Reset to page 1 when sales data changes but keep pagination working
  const salesCount = sales.length;
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [salesCount, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleExportCSV = () => {
    if (sales.length === 0) return;

    const headers = [
      "ID",
      "Data/Hora",
      "Terminal",
      "Valor",
      "Tipo de Pagamento",
      "Status",
      "Bandeira",
      "Parcelas",
      "Origem"
    ];

    const csvContent = [
      headers.join(","),
      ...sales.map(sale => [
        sale.id,
        sale.transaction_date,
        sale.terminal,
        sale.gross_amount,
        sale.payment_type,
        sale.status,
        sale.brand,
        sale.installments || 1,
        sale.source
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `vendas-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate totals
  const totalAmount = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {sales.length} {sales.length === 1 ? 'registro encontrado' : 'registros encontrados'} 
              {sales.length > 0 && ` - Total: ${formatCurrency(totalAmount)}`}
            </p>
          </div>
          {sales.length > 0 && (
            <Button onClick={handleExportCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sales.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma venda encontrada com os filtros aplicados.</p>
            <p className="text-sm mt-2">Aguardando seleção de terminais ou ajuste nos filtros.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">ID</TableHead>
                    <TableHead className="min-w-[130px]">Data/Hora</TableHead>
                    <TableHead className="min-w-[100px]">Terminal</TableHead>
                    <TableHead className="min-w-[100px] text-right">Valor</TableHead>
                    <TableHead className="min-w-[120px]">Tipo</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[100px]">Bandeira</TableHead>
                    <TableHead className="min-w-[80px]">Parcelas</TableHead>
                    <TableHead className="min-w-[100px]">Origem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-mono text-xs">
                        {sale.id.length > 20 ? `${sale.id.substring(0, 20)}...` : sale.id}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {sale.transaction_date}
                      </TableCell>
                      <TableCell>{sale.terminal}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(sale.gross_amount)}
                      </TableCell>
                      <TableCell>{sale.payment_type}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          sale.status.toLowerCase() === 'aprovada' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {sale.status}
                        </span>
                      </TableCell>
                      <TableCell>{sale.brand}</TableCell>
                      <TableCell>{sale.installments || 1}x</TableCell>
                      <TableCell>{sale.source}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(endIndex, sales.length)} de {sales.length} registros
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(pageNumber)}
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
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
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
