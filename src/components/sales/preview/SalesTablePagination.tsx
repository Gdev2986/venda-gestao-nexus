
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SalesTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number;
  onPageChange: (page: number) => void;
}

export const SalesTablePagination = ({ 
  currentPage, 
  totalPages, 
  totalCount, 
  onPageChange 
}: SalesTablePaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-muted-foreground">
        Página {currentPage} de {totalPages} 
        {totalCount && ` - ${totalCount.toLocaleString('pt-BR')} registros totais`}
        <span className="ml-2 text-xs">
          (10 por página)
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
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
                onClick={() => onPageChange(pageNumber)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
