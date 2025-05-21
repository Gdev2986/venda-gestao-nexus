
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import RequestTypeIcon from "./RequestTypeIcon";
import { formatDate } from "@/utils/format";

interface SupportRequest {
  id: string;
  subject: string;
  message: string;
  type: "MACHINE" | "SUPPLIES" | "PAYMENT" | "OTHER";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  created_at: string;
  response?: string;
}

interface RequestsListProps {
  requests: SupportRequest[];
  onViewDetails: (request: SupportRequest) => void;
}

const RequestsList = ({ requests, onViewDetails }: RequestsListProps) => {
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
    <div className="space-y-4">
      {requests.length > 0 ? (
        requests.map((request) => (
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
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhuma solicitação encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default RequestsList;
