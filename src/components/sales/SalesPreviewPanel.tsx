
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NormalizedSale } from "@/utils/sales-processor";
import { DataTable } from "@/components/ui/data-table";
import { salesTableColumns } from "./preview/SalesTableColumns";
import { SalesTableHeader } from "./preview/SalesTableHeader";
import { SalesTablePagination } from "./preview/SalesTablePagination";
import { SalesPreviewSummary } from "./preview/SalesPreviewSummary";
import { useSalesPreviewPagination } from "@/hooks/use-sales-preview-pagination";

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
  const {
    currentPage,
    totalPages,
    paginatedSales,
    handlePageChange
  } = useSalesPreviewPagination({
    sales,
    externalCurrentPage,
    externalTotalPages,
    externalOnPageChange
  });

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
        
        <SalesPreviewSummary
          sales={sales}
          paginatedSales={paginatedSales}
          currentPage={currentPage}
          totalPages={totalPages}
        />
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
