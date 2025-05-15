
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WalletIcon } from "lucide-react";

interface StatsCardsProps {
  stats: {
    totalSales: number;
    pendingPayments: number;
    completedPayments: number;
    clientBalance: number;
  };
  loading: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Vendas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalSales)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pagamentos Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(stats.pendingPayments)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pagamentos Realizados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(stats.completedPayments)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo Disponível
          </CardTitle>
          <WalletIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-7 w-36" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(stats.clientBalance)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StatsCards;
