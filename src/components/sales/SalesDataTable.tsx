
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  CardDescription,
} from "@/components/ui/card";
import { PaymentMethod, Sale } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesDataTableProps {
  sales: Sale[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  totals: {
    grossAmount: number;
    netAmount: number;
    count: number;
  };
}

const getPaymentMethodLabel = (method: string | PaymentMethod) => {
  // Ensure method is handled as a string
  const paymentMethodStr = String(method);
  
  switch (paymentMethodStr) {
    case PaymentMethod.CREDIT:
      return <Badge variant="outline">Crédito</Badge>;
    case PaymentMethod.DEBIT:
      return <Badge variant="outline" className="border-green-600 text-green-600">Débito</Badge>;
    case PaymentMethod.PIX:
      return <Badge variant="outline" className="border-yellow-600 text-yellow-600">Pix</Badge>;
    default:
      return <Badge variant="outline">{paymentMethodStr}</Badge>;
  }
};

// Generate random number of installments based on payment method
const getInstallments = (sale: Sale) => {
  if (sale.payment_method === PaymentMethod.CREDIT) {
    // For credit, random between 1x and 12x
    return `${Math.floor(Math.random() * 12) + 1}x`;
  } else {
    // For debit and PIX, always 1x
    return "1x";
  }
};

const SalesDataTable = ({ 
  sales, 
  currentPage, 
  totalPages, 
  isLoading, 
  onPageChange,
  totals
}: SalesDataTableProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>
              {isLoading 
                ? "Carregando..." 
                : `${totals.count} ${totals.count === 1 ? 'venda encontrada' : 'vendas encontradas'}`}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col sm:items-center">
              <span className="font-medium">Total Bruto:</span>
              <span className="text-foreground font-bold">
                {new Intl.NumberFormat("pt-BR", { 
                  style: "currency", 
                  currency: "BRL" 
                }).format(totals.grossAmount)}
              </span>
            </div>
            
            <div className="flex flex-col sm:items-center">
              <span className="font-medium">Total Líquido:</span>
              <span className="text-foreground font-bold">
                {new Intl.NumberFormat("pt-BR", { 
                  style: "currency", 
                  currency: "BRL" 
                }).format(totals.netAmount)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Código</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Valor Bruto</TableHead>
                    <TableHead className="text-right">Valor Líquido</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Parcelas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length > 0 ? (
                    sales.map((sale) => (
                      <TableRow key={sale.id} className="cursor-pointer hover:bg-muted/80">
                        <TableCell className="font-medium">{sale.code}</TableCell>
                        <TableCell>
                          {format(new Date(sale.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell>{sale.terminal}</TableCell>
                        <TableCell>{sale.client_name}</TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.gross_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.net_amount)}
                        </TableCell>
                        <TableCell>{getPaymentMethodLabel(sale.payment_method)}</TableCell>
                        <TableCell>{getInstallments(sale)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nenhuma venda encontrada. Tente outros filtros.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {sales.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 py-2">
                <div className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Página anterior</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNumber)}
                          className="w-9 h-9"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima página</span>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDataTable;
