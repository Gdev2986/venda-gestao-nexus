
import React from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface UserPaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
}

const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages,
}) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageButtons = () => {
    const buttons = [];
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Always show at least 5 pages if available
    if (endPage - startPage < 4 && totalPages > 5) {
      if (currentPage < 3) {
        endPage = Math.min(totalPages, 5);
      } else if (currentPage > totalPages - 2) {
        startPage = Math.max(1, totalPages - 4);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          className="w-10 h-10 p-0"
          onClick={() => goToPage(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-2 justify-end mt-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <div className="flex gap-1">{renderPageButtons()}</div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default UserPagination;
