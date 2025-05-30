
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NormalizedSale } from "@/utils/sales-processor";
import { DataTable } from "@/components/ui/data-table";
import { salesTableColumns } from "./preview/SalesTableColumns";
import { SalesTableHeader } from "./preview/SalesTableHeader";
import { SalesTablePagination } from "./preview/SalesTablePagination";

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
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalCount,
  isLoading = false
}: SalesPreviewPanelProps) => {
  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <SalesTableHeader
          title={title}
          totalCount={totalCount}
          filteredCount={sales.length}
          searchTerm=""
          onSearchChange={() => {}}
        />
      </CardHeader>
      
      <CardContent className="p-0">
        <DataTable
          columns={salesTableColumns}
          data={sales}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
        
        {onPageChange && (
          <SalesTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SalesPreviewPanel;
