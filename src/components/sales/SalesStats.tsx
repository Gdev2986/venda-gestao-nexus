
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SalesStatsProps {
  totalGross: number;
  totalNet: number;
  totalCount: number;
  averageTicket: number;
  isLoading?: boolean;
}

const SalesStats = ({
  totalGross,
  totalNet,
  totalCount,
  averageTicket,
  isLoading = false
}: SalesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Bruto</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalGross)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Líquido</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(totalNet)}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Número de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded w-12" />
          ) : (
            <div className="text-2xl font-bold">
              {totalCount}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-6 bg-muted animate-pulse rounded w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {formatCurrency(averageTicket)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesStats;
