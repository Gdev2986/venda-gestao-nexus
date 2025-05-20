
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportRequest } from "@/types/support.types";
import { RequestCard } from "./RequestCard";

interface RequestListProps {
  requests: SupportRequest[];
  onViewDetails: (request: SupportRequest) => void;
}

export function RequestList({ requests, onViewDetails }: RequestListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Minhas Solicitações</CardTitle>
        <CardDescription>
          Verifique o status de suas solicitações de suporte
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length > 0 ? (
          <div className="space-y-4">
            {requests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onViewDetails={onViewDetails} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
