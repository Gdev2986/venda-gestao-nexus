
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  CreditCard,
  Package,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  type: "payment_approved" | "payment_rejected" | "client_added" | "machine_registered" | "payment_requested";
  entityId: string;
  entityName: string;
  timestamp: string;
  actor?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
}

const ActivityIcon = ({ type }: { type: Activity["type"] }) => {
  switch (type) {
    case "payment_approved":
      return <CheckCircle2 className="h-8 w-8 text-green-500" />;
    case "payment_rejected":
      return <XCircle className="h-8 w-8 text-red-500" />;
    case "client_added":
      return <User className="h-8 w-8 text-blue-500" />;
    case "machine_registered":
      return <Package className="h-8 w-8 text-amber-500" />;
    case "payment_requested":
      return <CreditCard className="h-8 w-8 text-purple-500" />;
    default:
      return <AlertCircle className="h-8 w-8 text-gray-500" />;
  }
};

const ActivityMessage = ({ activity }: { activity: Activity }) => {
  switch (activity.type) {
    case "payment_approved":
      return (
        <p>
          Pagamento para <span className="font-medium">{activity.entityName}</span> foi aprovado
          {activity.actor && <span> por <span className="font-medium">{activity.actor}</span></span>}
        </p>
      );
    case "payment_rejected":
      return (
        <p>
          Pagamento para <span className="font-medium">{activity.entityName}</span> foi recusado
          {activity.actor && <span> por <span className="font-medium">{activity.actor}</span></span>}
        </p>
      );
    case "client_added":
      return (
        <p>
          Novo cliente <span className="font-medium">{activity.entityName}</span> foi cadastrado
          {activity.actor && <span> por <span className="font-medium">{activity.actor}</span></span>}
        </p>
      );
    case "machine_registered":
      return (
        <p>
          Nova máquina registrada para <span className="font-medium">{activity.entityName}</span>
          {activity.actor && <span> por <span className="font-medium">{activity.actor}</span></span>}
        </p>
      );
    case "payment_requested":
      return (
        <p>
          <span className="font-medium">{activity.entityName}</span> solicitou um novo pagamento
        </p>
      );
    default:
      return <p>Atividade desconhecida</p>;
  }
};

const RecentActivities = ({ activities, isLoading = false }: RecentActivitiesProps) => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start">
                <ActivityIcon type={activity.type} />
                <div className="space-y-1">
                  <ActivityMessage activity={activity} />
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>Nenhuma atividade recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
