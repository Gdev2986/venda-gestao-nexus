
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { NormalizedSale } from "@/utils/sales-processor";

interface SalesStatCardsProps {
  filteredSales: NormalizedSale[];
  isLoading: boolean;
}

export const SalesStatCards = ({ filteredSales, isLoading }: SalesStatCardsProps) => {
  // Calculate statistics
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.gross_amount, 0);
  const averageAmount = filteredSales.length > 0 ? totalAmount / filteredSales.length : 0;
  const uniqueTerminals = new Set(filteredSales.map(sale => sale.terminal)).size;
  const approvedSales = filteredSales.filter(sale => sale.status.toLowerCase() === 'aprovada').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Transações</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              filteredSales.length.toLocaleString('pt-BR')
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {approvedSales} aprovadas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            ) : (
              formatCurrency(totalAmount)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Volume total processado
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading || filteredSales.length === 0 ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : (
              formatCurrency(averageAmount)
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Por transação
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Terminais Únicos</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <div className="h-8 w-12 bg-muted animate-pulse rounded" />
            ) : (
              uniqueTerminals
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Máquinas ativas
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
