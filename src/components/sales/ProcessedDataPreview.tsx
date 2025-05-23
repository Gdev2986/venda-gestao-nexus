
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
import TablePagination from "@/components/ui/table-pagination";
import { formatCurrency } from "@/lib/formatters";
import { NormalizedSale } from "@/pages/admin/Sales";

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
  const itemsPerPage = 15;
  
  // Pagination
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);
  
  // Calculate totals
  const totalAmount = data.reduce((sum, item) => sum + item.gross_amount, 0);
  
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
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[600px] md:w-[700px] lg:w-[900px] overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Pré-visualização dos Dados</SheetTitle>
          <SheetDescription>
            {data.length} {data.length === 1 ? "registro" : "registros"} processados
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 bg-muted/30 p-3 rounded-md">
          <div className="text-sm mb-2 sm:mb-0">
            <span className="font-medium">Total de Transações:</span>{" "}
            <span className="font-semibold">{data.length}</span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Valor Total Bruto:</span>{" "}
            <span className="font-semibold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
        
        <div className="max-h-[calc(100vh-250px)] overflow-auto border rounded-md">
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
                    <TableCell>{item.payment_type}</TableCell>
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
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
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
