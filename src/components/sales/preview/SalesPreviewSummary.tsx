
import { formatCurrency } from "@/lib/formatters";
import { NormalizedSale } from "@/utils/sales-processor";

interface SalesPreviewSummaryProps {
  sales: NormalizedSale[];
  paginatedSales: NormalizedSale[];
  currentPage: number;
  totalPages: number;
}

export const SalesPreviewSummary = ({ 
  sales, 
  paginatedSales, 
  currentPage, 
  totalPages 
}: SalesPreviewSummaryProps) => {
  const totalAmount = sales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const currentPageAmount = paginatedSales.reduce((sum, sale) => sum + sale.gross_amount, 0);

  return (
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
  );
};
