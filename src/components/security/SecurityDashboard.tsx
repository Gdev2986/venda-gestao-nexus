
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Clock, CheckCircle } from 'lucide-react';
import { useSecurityMonitoring } from '@/hooks/auth/useSecurityMonitoring';
import { useEnterpriseAuthContext } from '@/contexts/EnterpriseAuthContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const SecurityDashboard = () => {
  const { securityEvents, auditLogs, isLoading, unresolvedCount, resolveSecurityEvent } = useSecurityMonitoring();
  const { user } = useEnterpriseAuthContext();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'suspicious_login': return <AlertTriangle className="w-4 h-4" />;
      case 'privilege_escalation': return <Shield className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando dashboard de segurança...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Segurança */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Não Resolvidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unresolvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logs de Auditoria</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Resolução</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityEvents.length > 0 ? 
                Math.round(((securityEvents.length - unresolvedCount) / securityEvents.length) * 100) 
                : 100}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Eventos de Segurança Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos de Segurança Recentes</CardTitle>
          <CardDescription>Últimos eventos de segurança detectados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityEvents.slice(0, 10).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getEventTypeIcon(event.event_type)}
                  <div>
                    <div className="font-medium">{event.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(event.created_at), { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity.toUpperCase()}
                  </Badge>
                  {!event.resolved && user && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveSecurityEvent(event.id, user.id)}
                    >
                      Resolver
                    </Button>
                  )}
                  {event.resolved && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Resolvido
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs de Auditoria Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Auditoria Recentes</CardTitle>
          <CardDescription>Últimas atividades de autenticação registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.slice(0, 15).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{log.event_type.replace('_', ' ').toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">
                      {log.metadata?.browser && `${log.metadata.browser} • `}
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true, locale: ptBR })}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {log.ip_address}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
