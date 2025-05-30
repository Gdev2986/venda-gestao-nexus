
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { NormalizedSale } from "@/utils/sales-processor";
import { SalesTablePagination } from "@/components/sales/preview/SalesTablePagination";
import { PaymentTypeBadge } from "@/components/sales/PaymentTypeBadge";

interface ProcessedDataPreviewProps {
  data: NormalizedSale[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProcessedDataPreview = ({ 
  data, 
  isOpen, 
  onOpenChange 
}: ProcessedDataPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Garantir que seja sempre 10
  
  // Pagination - força o limite de 10 itens por página
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex); // Usar slice para garantir o limite
  
  // Calculate totals
  const totalAmount = data.reduce((sum, item) => sum + item.gross_amount, 0);
  const currentPageAmount = currentData.reduce((sum, item) => sum + item.gross_amount, 0);
  
  // Format date
  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dateObj);
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

  // Handler para mudança de página que reseta se necessário
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when data changes
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] md:w-[700px] lg:w-[900px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Pré-visualização dos Dados</SheetTitle>
          <SheetDescription>
            {data.length} {data.length === 1 ? "registro" : "registros"} processados
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-3 rounded-md">
            <div className="text-sm mb-2 sm:mb-0">
              <span className="font-medium">Total de Transações:</span>{" "}
              <span className="font-semibold text-primary">{data.length.toLocaleString('pt-BR')}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Valor Total Bruto:</span>{" "}
              <span className="font-semibold text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-accent/20 p-3 rounded-md">
              <div className="text-sm mb-2 sm:mb-0">
                <span className="font-medium">Página {currentPage} de {totalPages}:</span>{" "}
                <span className="font-semibold">{currentData.length} registros</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Valor da Página:</span>{" "}
                <span className="font-semibold">{formatCurrency(currentPageAmount)}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="max-h-[calc(100vh-400px)] overflow-auto border rounded-md">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
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
              {currentData.length > 0 ? (
                currentData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <PaymentTypeBadge 
                        paymentType={item.payment_type} 
                        installments={item.installments} 
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(item.gross_amount)}
                    </TableCell>
                    <TableCell>{formatDate(item.transaction_date)}</TableCell>
                    <TableCell>{item.installments}</TableCell>
                    <TableCell>{item.terminal}</TableCell>
                    <TableCell>{item.brand}</TableCell>
                    <TableCell>{item.source}</TableCell>
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
        
        {totalPages > 1 && (
          <div className="mt-4">
            <SalesTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={data.length}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ProcessedDataPreview;
