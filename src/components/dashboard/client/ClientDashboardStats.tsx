
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, CreditCard, DollarSign, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ClientDashboardStatsProps {
  currentBalance: number;
  totalSales: number;
  totalTransactions: number;
  avgTicket: number;
  isLoading?: boolean;
}

export const ClientDashboardStats = ({
  currentBalance,
  totalSales,
  totalTransactions,
  avgTicket,
  isLoading = false
}: ClientDashboardStatsProps) => {
  const cards = [
    {
      title: "Saldo Atual",
      value: formatCurrency(currentBalance),
      subtitle: "Disponível para saque",
      icon: DollarSign,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-l-green-500"
    },
    {
      title: "Total de Vendas",
      value: formatCurrency(totalSales),
      subtitle: "Vendas acumuladas",
      icon: TrendingUp,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-l-blue-500"
    },
    {
      title: "Transações",
      value: totalTransactions.toString(),
      subtitle: "Total processado",
      icon: CreditCard,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-l-purple-500"
    },
    {
      title: "Ticket Médio",
      value: formatCurrency(avgTicket),
      subtitle: "Valor médio por venda",
      icon: Clock,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-l-orange-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className={`${card.borderColor} border-l-4 hover:shadow-md transition-shadow`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {card.subtitle}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
