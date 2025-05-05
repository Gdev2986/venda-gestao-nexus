
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "./table-pagination";

interface Column {
  id: string;
  header: string;
  accessorKey?: string;
  cell?: (info: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

export function DataTable({ columns, data, currentPage, totalPages, onPageChange, isLoading }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id}>{column.header}</TableHead>
            ))}
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
                {columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column.id}`}>
                    {column.cell
                      ? column.cell({ row: { original: row } })
                      : column.accessorKey
                      ? row[column.accessorKey]
                      : null}
                  </TableCell>
                ))}
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
