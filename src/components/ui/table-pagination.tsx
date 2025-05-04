
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  page,
  total,
  onPageChange,
  siblingCount = 1,
}) => {
  // Get page numbers logic
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // If we're not at the beginning, add ellipsis
    if (page > siblingCount + 2) {
      pageNumbers.push('...');
    }
    
    // Add sibling pages around current page
    for (let i = Math.max(2, page - siblingCount); i <= Math.min(total - 1, page + siblingCount); i++) {
      pageNumbers.push(i);
    }
    
    // If we're not at the end, add ellipsis
    if (page < total - siblingCount - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there is more than one page
    if (total > 1) {
      pageNumbers.push(total);
    }
    
    return pageNumbers;
  };

  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((pageNumber, index) => 
        typeof pageNumber === 'string' ? (
          <span key={`ellipsis-${index}`} className="px-2">
            {pageNumber}
          </span>
        ) : (
          <Button
            key={pageNumber}
            variant={pageNumber === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(Number(pageNumber))}
          >
            {pageNumber}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === total}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Export as default for backwards compatibility
export default TablePagination;
