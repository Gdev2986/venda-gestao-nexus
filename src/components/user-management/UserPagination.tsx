
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserPagination = ({ currentPage, totalPages, onPageChange }: UserPaginationProps) => {
  // Não mostrar paginação se houver apenas uma página
  if (totalPages <= 1) return null;

  // Criar um array de páginas para exibir
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Se o número total de páginas for menor que o máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar a primeira página
      pages.push(1);
      
      // Calcular páginas do meio
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Ajustar para sempre mostrar 3 páginas do meio, se possível
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }
      
      // Adicionar elipse antes, se necessário
      if (startPage > 2) {
        pages.push("ellipsis-start");
      }
      
      // Adicionar páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Adicionar elipse depois, se necessário
      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end");
      }
      
      // Sempre mostrar a última página
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
        
        {pageNumbers.map((page, index) => (
          page === "ellipsis-start" || page === "ellipsis-end" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <PaginationLink 
                isActive={page === currentPage}
                onClick={() => typeof page === "number" && onPageChange(page)}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default UserPagination;
