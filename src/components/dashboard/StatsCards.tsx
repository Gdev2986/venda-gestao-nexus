
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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium">Saldo Atual</CardTitle>
          <DollarSignIcon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(currentBalance)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Disponível para saque
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium">Valor Bruto</CardTitle>
          <ArrowUpIcon className="h-3 w-3 md:h-4 md:w-4 text-success" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(yesterdayGross)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Antes das taxas
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium">Valor Líquido</CardTitle>
          <ArrowDownIcon className="h-3 w-3 md:h-4 md:w-4 text-danger" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {formatCurrency(yesterdayNet)}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
                Margem de {profitMargin}%
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-3 md:p-6 pb-1 md:pb-2 space-y-0">
          <CardTitle className="text-xs md:text-sm font-medium">Total Vendas</CardTitle>
          <ShoppingCartIcon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-1 md:pt-0">
          {isLoading ? (
            <div className="h-6 md:h-8 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <div className="text-base md:text-2xl font-bold">
                {totalSales}
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground mt-1">
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
