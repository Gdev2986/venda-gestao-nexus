
import { useState, useEffect } from "react";
import { NormalizedSale } from "@/utils/sales-processor";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import TablePagination from "@/components/ui/table-pagination";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface SalesPreviewPanelProps {
  sales: NormalizedSale[];
  title?: string;
}

const SalesPreviewPanel = ({ 
  sales,
  title = "Pré-visualização dos dados" 
}: SalesPreviewPanelProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate total pages
  const totalPages = Math.ceil(sales.length / itemsPerPage);
  
  // Calculate current page data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, sales.length);
  const currentPageData = sales.slice(startIndex, endIndex);
  
  // Reset to first page when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [sales]);
  
  // Calculate totals
  const totalAmount = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  
  // Render status badge with appropriate styling
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

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4 flex flex-col sm:flex-row justify-between gap-4 bg-muted/30">
          <div className="text-sm">
            <span className="font-medium">Total de transações:</span>{" "}
            <span className="font-semibold">{sales.length}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Valor total bruto:</span>{" "}
            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        
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
              {currentPageData.length > 0 ? (
                currentPageData.map((sale, index) => (
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
                    Nenhum dado disponível para visualização
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {totalPages > 1 && (
        <CardFooter className="flex justify-center py-4">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardFooter>
      )}
    </Card>
  );
};

export default SalesPreviewPanel;
