import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { PaymentMethod, Sale } from "@/types";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useBreakpoint } from "@/hooks/use-mobile";

interface SalesTableProps {
  sales: Sale[];
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  isLoading: boolean;
  totals: {
    grossAmount: number;
    netAmount: number;
  };
}

const getPaymentMethodLabel = (method: PaymentMethod | string) => {
  switch (method) {
    case PaymentMethod.CREDIT:
    case "CREDIT":
    case "credit":
      return <Badge variant="outline">Crédito</Badge>;
    case PaymentMethod.DEBIT:
    case "DEBIT":
    case "debit":
      return <Badge variant="outline" className="border-success text-success">Débito</Badge>;
    case PaymentMethod.PIX:
    case "PIX":
    case "pix":
      return <Badge variant="outline" className="border-warning text-warning">Pix</Badge>;
    default:
      return <Badge variant="outline">{method}</Badge>;
  }
};

const SalesTable = ({ sales, page, setPage, totalPages, isLoading, totals }: SalesTableProps) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);
  const isTablet = breakpoint === 'md';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
          <CardTitle className="text-lg">Lista de Vendas</CardTitle>
          <div className="text-xs sm:text-sm text-muted-foreground space-x-2 sm:space-x-4">
            <span>Total Bruto: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.grossAmount)}</span>
            <span>Total Líquido: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totals.netAmount)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 sm:px-4 py-2">
        {isLoading ? (
          <div className="space-y-4 px-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 sm:h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto border-y">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm">Código</TableHead>
                    <TableHead className="text-xs sm:text-sm">Data</TableHead>
                    <TableHead className="text-xs sm:text-sm">Terminal</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">Valor Bruto</TableHead>
                    <TableHead className="text-xs sm:text-sm text-right">Valor Líquido</TableHead>
                    <TableHead className="text-xs sm:text-sm">Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length > 0 ? (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4">{sale.code}</TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4">
                          {format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4">{sale.terminal}</TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.gross_amount)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4 text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.net_amount)}
                        </TableCell>
                        <TableCell className="text-xs sm:text-sm p-2 sm:p-4">{getPaymentMethodLabel(sale.payment_method)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 sm:py-8 text-muted-foreground text-xs sm:text-sm">
                        Nenhuma venda encontrada. 
                        {" Tente outros filtros."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {sales.length > 0 && (
              <div className="mt-3 sm:mt-4">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page > 1) setPage(page - 1);
                        }}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(isMobile ? 3 : 5, totalPages) }, (_, i) => {
                      let pageNumber;
                      
                      if (totalPages <= (isMobile ? 3 : 5)) {
                        pageNumber = i + 1;
                      } else if (page <= (isMobile ? 2 : 3)) {
                        pageNumber = i + 1;
                      } else if (page >= totalPages - (isMobile ? 1 : 2)) {
                        pageNumber = totalPages - (isMobile ? 2 : 4) + i;
                      } else {
                        pageNumber = page - (isMobile ? 1 : 2) + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            href="#"
                            className="text-xs sm:text-sm h-8 sm:h-9 w-8 sm:w-9"
                            isActive={pageNumber === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(pageNumber);
                            }}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > (isMobile ? 3 : 5) && page < totalPages - (isMobile ? 1 : 2) && (
                      <PaginationItem>
                        <PaginationEllipsis className="h-8 sm:h-9" />
                      </PaginationItem>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className="text-xs sm:text-sm h-8 sm:h-9"
                        onClick={(e) => {
                          e.preventDefault();
                          if (page < totalPages) setPage(page + 1);
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesTable;
