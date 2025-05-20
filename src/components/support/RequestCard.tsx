
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupportRequest } from "@/types/support.types";
import { RequestTypeIcon } from "./RequestTypeIcon";
import { StatusBadge } from "./StatusBadge";

interface RequestCardProps {
  request: SupportRequest;
  onViewDetails: (request: SupportRequest) => void;
}

export function RequestCard({ request, onViewDetails }: RequestCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRequestTypeLabel = (type: string) => {
    switch(type) {
      case "MACHINE": return "Máquina";
      case "SUPPLIES": return "Suprimentos";
      case "PAYMENT": return "Pagamento";
      case "OTHER": return "Outros";
      default: return type;
    }
  };

  return (
    <Card key={request.id} className="overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RequestTypeIcon type={request.type} />
              <h3 className="font-medium">{request.subject}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Tipo: {getRequestTypeLabel(request.type)}</span>
              <span>•</span>
              <span>Criado em: {formatDate(request.created_at)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={request.status} />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewDetails(request)}
            >
              Detalhes
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
