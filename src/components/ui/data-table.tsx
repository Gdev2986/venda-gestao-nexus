
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
import { cn } from "@/lib/utils";

// Updated interface to use ColumnDef
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function DataTable<TData extends object>({ 
  columns, 
  data, 
  currentPage, 
  totalPages, 
  onPageChange, 
  isLoading,
  className
}: DataTableProps<TData>) {
  return (
    <div className={cn("rounded-md border overflow-x-auto", className)}>
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
                Carregando...
              </TableCell>
            </TableRow>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((column) => {
                  const columnId = String(column.id);
                  
                  return (
                    <TableCell key={`${rowIndex}-${columnId}`} className="py-3">
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
      
      {totalPages && totalPages > 1 && currentPage && onPageChange && (
        <div className="px-4 py-2 flex justify-center">
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
