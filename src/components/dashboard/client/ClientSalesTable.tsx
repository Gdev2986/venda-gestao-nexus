
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { PaymentMethod } from "@/types";

interface Sale {
  id: string;
  date: string;
  code: string;
  terminal: string;
  gross_amount: number;
  net_amount: number;
  payment_method: PaymentMethod;
  installments?: number;
}

interface ClientSalesTableProps {
  sales: Sale[];
  isLoading?: boolean;
}

export const ClientSalesTable = ({ sales, isLoading = false }: ClientSalesTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getPaymentMethodBadge = (method: PaymentMethod, installments?: number) => {
    switch (method) {
      case PaymentMethod.CREDIT:
        const installmentText = installments && installments > 1 ? ` ${installments}x` : " À Vista";
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
            Crédito{installmentText}
          </Badge>
        );
      case PaymentMethod.DEBIT:
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            Débito
          </Badge>
        );
      case PaymentMethod.PIX:
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-700 bg-purple-50">
            PIX
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-gray-500 text-gray-700 bg-gray-50">
            {method}
          </Badge>
        );
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.terminal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="border-l-4 border-l-emerald-500">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-emerald-600" />
              Vendas Detalhadas
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredSales.length} transações encontradas
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou terminal..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <div className="h-4 bg-muted animate-pulse rounded flex-1" />
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                  <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  <div className="h-4 bg-muted animate-pulse rounded w-20" />
                </div>
              ))}
            </div>
          ) : paginatedSales.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Terminal</TableHead>
                    <TableHead className="text-right">Valor Bruto</TableHead>
                    <TableHead className="text-right">Valor Líquido</TableHead>
                    <TableHead className="text-center">Pagamento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">
                        {format(new Date(sale.date), "dd/MM/yy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {sale.code}
                      </TableCell>
                      <TableCell>
                        {sale.terminal}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(sale.gross_amount)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-700">
                        {formatCurrency(sale.net_amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getPaymentMethodBadge(sale.payment_method, sale.installments)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 p-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma venda encontrada no período selecionado.</p>
              {searchTerm && (
                <p className="text-sm mt-1">
                  Tente ajustar os filtros de busca.
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
