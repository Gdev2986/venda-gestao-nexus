
import { useState, useEffect } from "react";
import { NormalizedSale } from "@/utils/sales-processor";

interface UseSalesPreviewPaginationProps {
  sales: NormalizedSale[];
  externalCurrentPage?: number;
  externalTotalPages?: number;
  externalOnPageChange?: (page: number) => void;
}

export const useSalesPreviewPagination = ({
  sales,
  externalCurrentPage,
  externalTotalPages,
  externalOnPageChange
}: UseSalesPreviewPaginationProps) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
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

  return {
    currentPage,
    totalPages,
    paginatedSales,
    handlePageChange
  };
};
