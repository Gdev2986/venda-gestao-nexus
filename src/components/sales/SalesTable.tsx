
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PaymentMethod, Sale } from "@/types";
import { EyeIcon, MoreHorizontalIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface SalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
}

const getPaymentMethodIcon = (method: PaymentMethod) => {
  switch (method) {
    case PaymentMethod.CREDIT:
      return <Badge variant="outline">Crédito</Badge>;
    case PaymentMethod.DEBIT:
      return <Badge variant="outline" className="border-success text-success">Débito</Badge>;
    case PaymentMethod.PIX:
      return <Badge variant="outline" className="border-warning text-warning">Pix</Badge>;
    default:
      return <Badge variant="outline">Outro</Badge>;
  }
};

const SalesTable = ({ sales, isLoading = false }: SalesTableProps) => {
  const viewSaleDetails = (saleId: string) => {
    console.log("Viewing sale details for:", saleId);
    // Implement this functionality
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Terminal</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell className="animate-pulse bg-gray-100 h-8"></TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (!sales.length) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        Nenhuma venda encontrada. Tente ajustar os filtros.
      </div>
    );
  }

  return (
    <>
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Terminal</TableHead>
              <TableHead className="text-right">Valor Bruto</TableHead>
              <TableHead className="text-right">Valor Líquido</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-medium">{sale.code}</TableCell>
                <TableCell>
                  {format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}
                </TableCell>
                <TableCell>{sale.terminal}</TableCell>
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
                <TableCell>{getPaymentMethodIcon(sale.payment_method)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => viewSaleDetails(sale.id)}>
                        <EyeIcon className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {sales.map((sale) => (
          <Card key={sale.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{sale.code}</span>
                {getPaymentMethodIcon(sale.payment_method)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-muted-foreground">Data:</p>
                  <p>{format(new Date(sale.date), "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Terminal:</p>
                  <p>{sale.terminal}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Bruto:</p>
                  <p className="font-medium">{new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(sale.gross_amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Líquido:</p>
                  <p className="font-medium">{new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(sale.net_amount)}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => viewSaleDetails(sale.id)}
                  className="gap-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default SalesTable;
