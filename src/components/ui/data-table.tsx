
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              // Safe way to get column id
              const columnId = typeof column.id === 'string' 
                ? column.id 
                : typeof column.accessorKey === 'string' 
                ? column.accessorKey as string
                : String(column.header);
              
              return (
                <TableHead key={columnId}>{String(column.header)}</TableHead>
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
                  // Safe way to get column id
                  const columnId = typeof column.id === 'string' 
                    ? column.id 
                    : typeof column.accessorKey === 'string' 
                    ? column.accessorKey as string 
                    : String(column.header);
                    
                  return (
                    <TableCell key={`${rowIndex}-${columnId}`}>
                      {column.cell 
                        ? typeof column.cell === 'function'
                          ? column.cell({ row: { original: row } } as any)
                          : null
                        : typeof column.accessorKey === 'string' && column.accessorKey in row
                        ? (row as any)[column.accessorKey as keyof TData]
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
