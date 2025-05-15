import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const getPaymentMethodLabel = (method: PaymentMethod | string) => {
  switch (method) {
    case PaymentMethod.CREDIT:
    case "CREDIT":
    case "credit":
      return <Badge variant="outline" className="text-xs py-0 px-1">Crédito</Badge>;
    case PaymentMethod.DEBIT:
    case "DEBIT":
    case "debit":
      return <Badge variant="outline" className="border-green-600 text-green-600 text-xs py-0 px-1">Débito</Badge>;
    case PaymentMethod.PIX:
    case "PIX":
    case "pix":
      return <Badge variant="outline" className="border-yellow-600 text-yellow-600 text-xs py-0 px-1">Pix</Badge>;
    default:
      return <Badge variant="outline" className="text-xs py-0 px-1">{method}</Badge>;
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
    <Card className="shadow-sm">
      <CardHeader className="p-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Vendas</CardTitle>
            <CardDescription className="text-xs">
              {isLoading 
                ? "Carregando..." 
                : `${totals.count} ${totals.count === 1 ? 'venda encontrada' : 'vendas encontradas'}`}
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 text-xs text-muted-foreground">
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
      <CardContent className="p-0 sm:p-2">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Código</TableHead>
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
                        <TableCell className="font-medium text-xs py-1">{sale.code}</TableCell>
                        <TableCell className="text-xs py-1">
                          {format(new Date(sale.date), "dd/MM HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-xs py-1">{sale.terminal}</TableCell>
                        <TableCell className="text-xs py-1">{sale.client_name}</TableCell>
                        <TableCell className="text-right text-xs py-1">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.gross_amount)}
                        </TableCell>
                        <TableCell className="text-right text-xs py-1">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(sale.net_amount)}
                        </TableCell>
                        <TableCell className="text-xs py-1">{getPaymentMethodLabel(sale.payment_method)}</TableCell>
                        <TableCell className="text-xs py-1">{getInstallments(sale)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground text-sm">
                        Nenhuma venda encontrada. Tente outros filtros.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {sales.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-2 py-1 px-2">
                <div className="text-xs text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-3 w-3" />
                    <span className="sr-only">Página anterior</span>
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                      let pageNumber;
                      
                      if (totalPages <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 2) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 1) {
                        pageNumber = totalPages - 2 + i;
                      } else {
                        pageNumber = currentPage - 1 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNumber}
                          variant={pageNumber === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(pageNumber)}
                          className="h-6 w-6 p-0 text-xs"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-3 w-3" />
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
