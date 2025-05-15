
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSignIcon, ArrowDownIcon, ArrowUpIcon, ShoppingCartIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  currentBalance: number;
  yesterdayGross: number;
  yesterdayNet: number;
  totalSales: number;
  isLoading?: boolean;
}

const StatsCards = ({
  currentBalance,
  yesterdayGross,
  yesterdayNet,
  totalSales,
  isLoading = false,
}: StatsCardsProps) => {
  // Calculate the profit margin percentage
  const profitMargin = yesterdayGross > 0 
    ? ((yesterdayNet / yesterdayGross) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(currentBalance)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Disponível para saque
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valor Bruto (Ontem)</CardTitle>
          <ArrowUpIcon className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(yesterdayGross)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Antes das taxas
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Valor Líquido (Ontem)</CardTitle>
          <ArrowDownIcon className="h-4 w-4 text-danger" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatCurrency(yesterdayNet)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Margem de {profitMargin}%
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {totalSales}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Transações registradas
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
