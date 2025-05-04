
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  // Add these for compatibility
  page?: number; 
  total?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  // Support both naming conventions
  page,
  total,
}) => {
  // Use page/total if currentPage/totalPages aren't provided
  const current = currentPage || page || 1;
  const totalPgs = totalPages || total || 1;
  
  // Get page numbers logic
  const getPageNumbers = (): (number | string)[] => {
    const pageNumbers: (number | string)[] = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // If we're not at the beginning, add ellipsis
    if (current > siblingCount + 2) {
      pageNumbers.push('...');
    }
    
    // Add sibling pages around current page
    for (let i = Math.max(2, current - siblingCount); i <= Math.min(totalPgs - 1, current + siblingCount); i++) {
      pageNumbers.push(i);
    }
    
    // If we're not at the end, add ellipsis
    if (current < totalPgs - siblingCount - 1) {
      pageNumbers.push('...');
    }
    
    // Always show last page if there is more than one page
    if (totalPgs > 1) {
      pageNumbers.push(totalPgs);
    }
    
    return pageNumbers;
  };

  if (totalPgs <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-4 space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(current - 1)}
        disabled={current === 1}
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
            variant={pageNumber === current ? "default" : "outline"}
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
        onClick={() => onPageChange(current + 1)}
        disabled={current === totalPgs}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Export as default for backwards compatibility
export default TablePagination;
