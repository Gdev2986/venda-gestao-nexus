
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NormalizedSale } from "@/utils/sales-processor";
import { DataTable } from "@/components/ui/data-table";
import { salesTableColumns } from "./preview/SalesTableColumns";
import { SalesTableHeader } from "./preview/SalesTableHeader";
import { SalesTablePagination } from "./preview/SalesTablePagination";
import { formatCurrency } from "@/lib/formatters";

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
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPageChange: externalOnPageChange,
  totalCount,
  isLoading = false
}: SalesPreviewPanelProps) => {
  // Estado interno de paginação quando não é controlado externamente
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const itemsPerPage = 10; // Garantir que seja sempre 10
  
  // Determinar se a paginação é controlada externamente ou internamente
  const isExternallyPaginated = externalCurrentPage !== undefined && externalOnPageChange !== undefined;
  
  // Usar paginação externa se disponível, senão usar interna
  const currentPage = isExternallyPaginated ? externalCurrentPage : internalCurrentPage;
  
  // Calcular paginação interna
  const internalTotalPages = Math.ceil(sales.length / itemsPerPage);
  const totalPages = isExternallyPaginated ? (externalTotalPages || 1) : internalTotalPages;
  
  // Dados paginados internamente
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = isExternallyPaginated ? sales : sales.slice(startIndex, endIndex);
  
  // Calcular totais
  const totalAmount = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const currentPageAmount = paginatedSales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  
  // Handler para mudança de página
  const handlePageChange = (page: number) => {
    if (isExternallyPaginated && externalOnPageChange) {
      externalOnPageChange(page);
    } else {
      if (page >= 1 && page <= internalTotalPages) {
        setInternalCurrentPage(page);
      }
    }
  };
  
  // Reset page when data changes (apenas para paginação interna)
  useEffect(() => {
    if (!isExternallyPaginated && internalCurrentPage > internalTotalPages && internalTotalPages > 0) {
      setInternalCurrentPage(1);
    }
  }, [sales.length, internalCurrentPage, internalTotalPages, isExternallyPaginated]);

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <SalesTableHeader
          title={title}
          totalCount={totalCount || sales.length}
          filteredCount={paginatedSales.length}
          searchTerm=""
          onSearchChange={() => {}}
        />
        
        {/* Informações de resumo */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-muted/30 p-3 rounded-md">
            <div className="mb-2 sm:mb-0">
              <span className="font-medium">Total de Transações:</span>{" "}
              <span className="font-semibold text-primary">{sales.length.toLocaleString('pt-BR')}</span>
            </div>
            <div>
              <span className="font-medium">Valor Total Bruto:</span>{" "}
              <span className="font-semibold text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-accent/20 p-3 rounded-md">
              <div className="mb-2 sm:mb-0">
                <span className="font-medium">Página {currentPage} de {totalPages}:</span>{" "}
                <span className="font-semibold">{paginatedSales.length} registros</span>
              </div>
              <div>
                <span className="font-medium">Valor da Página:</span>{" "}
                <span className="font-semibold">{formatCurrency(currentPageAmount)}</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <DataTable
          columns={salesTableColumns}
          data={paginatedSales}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
        
        {/* Paginação - mostrar sempre que houver mais de 1 página */}
        {totalPages > 1 && (
          <SalesTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount || sales.length}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPreviewPanel;
