
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sale, PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  totals?: {
    grossAmount: number;
    netAmount: number;
    count: number;
  };
}

const SalesTable = ({
  sales,
  isLoading = false,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  totals,
}: SalesTableProps) => {
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT:
        return "Crédito";
      case PaymentMethod.DEBIT:
        return "Débito";
      case PaymentMethod.PIX:
        return "PIX";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Nenhuma venda encontrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead className="hidden md:table-cell">Data</TableHead>
              <TableHead className="hidden sm:table-cell">Terminal</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor Bruto</TableHead>
              <TableHead className="hidden lg:table-cell">Valor Líquido</TableHead>
              <TableHead className="hidden sm:table-cell">Método</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.code}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {new Date(sale.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="hidden sm:table-cell">{sale.terminal}</TableCell>
                <TableCell>{sale.client_name}</TableCell>
                <TableCell>R$ {sale.gross_amount.toFixed(2)}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  R$ {sale.net_amount.toFixed(2)}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {getPaymentMethodLabel(sale.payment_method)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view for each sale record */}
      <div className="sm:hidden space-y-4">
        {sales.map((sale) => (
          <div key={sale.id} className="border rounded-md p-4 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">{sale.code}</span>
              <span className="text-sm text-muted-foreground">
                {new Date(sale.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <div className="text-sm">{sale.client_name}</div>
            <div className="flex justify-between mt-2">
              <span className="text-sm text-muted-foreground">
                {getPaymentMethodLabel(sale.payment_method)}
              </span>
              <span className="font-medium">R$ {sale.gross_amount.toFixed(2)}</span>
            </div>
            <div className="text-xs text-right text-muted-foreground">
              Líquido: R$ {sale.net_amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {onPageChange && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Próxima página</span>
            </Button>
          </div>
        </div>
      )}

      {totals && (
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm">
            <div className="mb-2 sm:mb-0">
              Total: <span className="font-bold">{totals.count} vendas</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <div>
                Valor Bruto: <span className="font-bold">R$ {totals.grossAmount.toFixed(2)}</span>
              </div>
              <div>
                Valor Líquido:{" "}
                <span className="font-bold">R$ {totals.netAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesTable;
