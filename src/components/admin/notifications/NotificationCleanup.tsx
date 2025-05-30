
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  cleanExpiredNotifications, 
  getNotificationStats, 
  NotificationStats,
  CleanupResult 
} from "@/services/notificationCleanupService";
import { Trash2, BarChart3, RefreshCw } from "lucide-react";

export const NotificationCleanup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [lastCleanup, setLastCleanup] = useState<CleanupResult | null>(null);
  const { toast } = useToast();

  const loadStats = async () => {
    try {
      const notificationStats = await getNotificationStats();
      setStats(notificationStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar estatísticas de notificações",
        variant: "destructive"
      });
    }
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      const result = await cleanExpiredNotifications();
      setLastCleanup(result);
      
      toast({
        title: "Limpeza Executada",
        description: `${result.deleted_count} notificações expiradas foram removidas`,
      });
      
      // Recarregar estatísticas
      await loadStats();
    } catch (error) {
      console.error('Erro na limpeza:', error);
      toast({
        title: "Erro",
        description: "Falha ao executar limpeza de notificações",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total_notifications}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.notifications_last_24h}</div>
                <div className="text-sm text-muted-foreground">Últimas 24h</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.notifications_last_week}</div>
                <div className="text-sm text-muted-foreground">Última semana</div>
              </div>
              <div className="text-center">
                <div className="text-xs">
                  {stats.oldest_notification ? 
                    new Date(stats.oldest_notification).toLocaleDateString('pt-BR') : 
                    'N/A'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Mais antiga</div>
              </div>
              <div className="text-center">
                <div className="text-xs">
                  {stats.newest_notification ? 
                    new Date(stats.newest_notification).toLocaleDateString('pt-BR') : 
                    'N/A'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Mais recente</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Carregando estatísticas...</div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Limpeza de Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Remove automaticamente notificações com mais de 120 horas (5 dias).
          </div>
          
          {lastCleanup && (
            <div className="p-3 bg-muted rounded-md">
              <div className="text-sm">
                <strong>Última limpeza:</strong> {new Date(lastCleanup.execution_time).toLocaleString('pt-BR')}
              </div>
              <div className="text-sm">
                <strong>Notificações removidas:</strong> 
                <Badge variant="outline" className="ml-2">
                  {lastCleanup.deleted_count}
                </Badge>
              </div>
            </div>
          )}
          
          <Button
            onClick={handleCleanup}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {isLoading ? "Executando..." : "Executar Limpeza"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
