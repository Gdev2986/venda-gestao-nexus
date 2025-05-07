
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Ban, ClipboardCheck, Settings, HelpCircle } from "lucide-react";

interface MachineStats {
  totalMachines: number;
  activeMachines: number;
  inactiveMachines: number;
  pendingServices: number;
  completedServices: number;
  serviceSuccessRate: number;
}

interface StatsCardsProps {
  stats: MachineStats | null;
  isLoading: boolean;
}

const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Active Machines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Máquinas Ativas
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.activeMachines || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats ? `${Math.round((stats.activeMachines / stats.totalMachines) * 100)}% do total` : "0% do total"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Inactive Machines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Máquinas Inativas
          </CardTitle>
          <Ban className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.inactiveMachines || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats ? `${Math.round((stats.inactiveMachines / stats.totalMachines) * 100)}% do total` : "0% do total"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Total Machines */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Máquinas
          </CardTitle>
          <Settings className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.totalMachines || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Na base de dados
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pending Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atendimentos Pendentes
          </CardTitle>
          <HelpCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.pendingServices || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando finalização
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Completed Services */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atendimentos Concluídos
          </CardTitle>
          <ClipboardCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.completedServices || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Nos últimos 30 dias
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Success Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Sucesso
          </CardTitle>
          {stats?.serviceSuccessRate && stats.serviceSuccessRate >= 80 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-7 w-20" />
          ) : (
            <>
              <div className="text-2xl font-bold">
                {stats?.serviceSuccessRate ? Math.round(stats.serviceSuccessRate) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Atendimentos resolvidos na primeira visita
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
