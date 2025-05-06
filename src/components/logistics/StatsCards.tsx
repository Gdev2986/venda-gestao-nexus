
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Settings, Box, Activity } from "lucide-react";

interface StatsCardsProps {
  stats: {
    activeMachines: number;
    machinesInMaintenance: number;
    paperRequests: number;
    pendingServices: number;
  } | null;
  isLoading: boolean;
}

const StatsCards = ({ stats, isLoading }: StatsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Máquinas em Operação</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse bg-muted h-8 w-16 rounded" />
          ) : (
            <div className="text-2xl font-bold">{stats?.activeMachines || 0}</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Manutenção</CardTitle>
          <Settings className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse bg-muted h-8 w-16 rounded" />
          ) : (
            <div className="text-2xl font-bold">{stats?.machinesInMaintenance || 0}</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitações de Bobinas</CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse bg-muted h-8 w-16 rounded" />
          ) : (
            <div className="text-2xl font-bold">{stats?.paperRequests || 0}</div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Atendimentos Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="animate-pulse bg-muted h-8 w-16 rounded" />
          ) : (
            <div className="text-2xl font-bold">{stats?.pendingServices || 0}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
