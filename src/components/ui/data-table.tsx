
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
  return (
    <div className="rounded-md border w-full">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => {
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => {
                    const columnId = String(column.id);
                    
                    return (
                      <TableCell key={`${rowIndex}-${columnId}`}>
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
