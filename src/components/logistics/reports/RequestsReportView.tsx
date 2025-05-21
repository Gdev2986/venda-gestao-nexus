
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface RequestsReportViewProps {
  pendingRequests: number;
  highPriorityRequests: number;
  resolvedRequests?: number; // Make this optional
  supportAgents?: number; // Make this optional
  typeCounts: Record<string, number>;
}

const RequestsReportView: React.FC<RequestsReportViewProps> = ({
  pendingRequests,
  highPriorityRequests,
  resolvedRequests = 0, // Provide default
  supportAgents = 0, // Provide default
  typeCounts,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas de Chamados</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium leading-none">Chamados Pendentes</p>
          <p className="text-2xl font-bold">{pendingRequests}</p>
          <span className="text-sm text-muted-foreground">
            Número total de chamados aguardando ação.
          </span>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Chamados de Alta Prioridade</p>
          <p className="text-2xl font-bold">{highPriorityRequests}</p>
          <span className="text-sm text-muted-foreground">
            Número de chamados marcados como alta prioridade.
          </span>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Chamados Resolvidos</p>
          <p className="text-2xl font-bold">{resolvedRequests}</p>
          <span className="text-sm text-muted-foreground">
            Número de chamados já resolvidos.
          </span>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Agentes de Suporte</p>
          <p className="text-2xl font-bold">{supportAgents}</p>
          <span className="text-sm text-muted-foreground">
            Número de agentes disponíveis.
          </span>
        </div>
        <div>
          <p className="text-sm font-medium leading-none">Chamados por Tipo</p>
          {Object.entries(typeCounts).map(([type, count]) => (
            <div key={type} className="flex items-center space-x-2">
              <span className="text-sm">{type}:</span>
              <span className="font-medium">{count || 0}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestsReportView;
