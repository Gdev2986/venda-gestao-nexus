import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";
import { useIsMobile } from "@/hooks/use-mobile";

// Updated interface to use ColumnDef
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function DataTable<TData extends object>({ 
  columns, 
  data, 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading 
}: DataTableProps<TData>) {
  const isMobile = useIsMobile();
  
  // For mobile, show reduced columns
  const visibleColumns = React.useMemo(() => {
    if (isMobile) {
      // Keep only the most important columns (first 2-3) on mobile
      return columns.slice(0, Math.min(3, columns.length));
    }
    return columns;
  }, [columns, isMobile]);

  return (
    <div className="rounded-md border w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map((column) => {
                // Safely access column header
                const headerValue = column.header 
                  ? typeof column.header === 'function' 
                    ? column.header({} as any)
                    : column.header
                  : '';
                
                return (
                  <TableHead key={String(column.id)}>{String(headerValue)}</TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleColumns.map((column) => {
                    const columnId = String(column.id);
                    
                    return (
                      <TableCell key={`${rowIndex}-${columnId}`} className="py-2 px-3">
                        {column.cell 
                          ? typeof column.cell === 'function'
                            ? column.cell({ row: { original: row } } as any)
                            : null
                          : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                  Nenhum dado encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages && totalPages > 1 && currentPage && onPageChange && (
        <div className="px-2 py-2 sm:px-4 sm:py-2 flex justify-center">
          <TablePagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
