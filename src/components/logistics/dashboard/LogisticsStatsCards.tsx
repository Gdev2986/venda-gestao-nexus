
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, PackageCheck, Truck, Users, Monitor, HelpCircle, ArrowUpRight, ArrowRight } from "lucide-react";
import { LogisticsStats } from "@/hooks/use-logistics-stats";

interface LogisticsStatsCardsProps {
  stats: LogisticsStats | null;
  isLoading: boolean;
}

const LogisticsStatsCards = ({ stats, isLoading }: LogisticsStatsCardsProps) => {
  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    borderColor, 
    iconColor,
    trend 
  }: { 
    title: string; 
    value: number; 
    subtitle: string; 
    icon: any; 
    borderColor: string; 
    iconColor: string;
    trend?: { value: string; isPositive: boolean };
  }) => (
    <Card className={`border-l-4 ${borderColor} hover:shadow-md transition-shadow`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2 rounded-md bg-muted/30`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
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
            <div className="text-2xl font-bold">{value}</div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{subtitle}</p>
              {trend && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {trend.isPositive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowRight className="h-3 w-3" />
                  )}
                  {trend.value}
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const machineAvailabilityRate = stats ? 
    Math.round((stats.onlineMachines / Math.max(stats.totalMachines, 1)) * 100) : 0;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Card 1: Total de Máquinas */}
      <StatCard
        title="Total de Máquinas"
        value={stats?.totalMachines || 0}
        subtitle="Máquinas sob gestão"
        icon={Monitor}
        borderColor="border-blue-500"
        iconColor="text-blue-500"
        trend={{ value: "Sistema", isPositive: true }}
      />

      {/* Card 2: Máquinas Online */}
      <StatCard
        title="Máquinas Online"
        value={stats?.onlineMachines || 0}
        subtitle={`${machineAvailabilityRate}% do total ativo`}
        icon={PackageCheck}
        borderColor="border-green-500"
        iconColor="text-green-500"
        trend={{ value: `${machineAvailabilityRate}%`, isPositive: machineAvailabilityRate >= 80 }}
      />

      {/* Card 3: Solicitações Pendentes */}
      <StatCard
        title="Solicitações Pendentes"
        value={stats?.pendingRequests || 0}
        subtitle="Aguardando atendimento"
        icon={HelpCircle}
        borderColor="border-orange-500"
        iconColor="text-orange-500"
        trend={{ value: "Prioritário", isPositive: false }}
      />

      {/* Card 4: Entregas Concluídas */}
      <StatCard
        title="Entregas Concluídas"
        value={stats?.completedDeliveries || 0}
        subtitle="Envios finalizados"
        icon={Truck}
        borderColor="border-green-500"
        iconColor="text-green-500"
        trend={{ value: "Sucesso", isPositive: true }}
      />
    </div>
  );
};

export default LogisticsStatsCards;
