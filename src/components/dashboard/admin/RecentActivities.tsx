
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Activity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type?: 'payment' | 'client' | 'sale' | 'partner' | 'system';
};

interface RecentActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
}

const RecentActivities = ({ activities, isLoading = false }: RecentActivitiesProps) => {
  // Function to get badge color based on activity type
  const getBadgeVariant = (type?: string) => {
    switch (type) {
      case 'payment':
        return "bg-blue-100 text-blue-800";
      case 'client':
        return "bg-green-100 text-green-800";
      case 'sale':
        return "bg-purple-100 text-purple-800";
      case 'partner':
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format relative time (today, yesterday, or date)
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    if (isToday) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (isYesterday) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Atividades Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{activity.title}</h4>
                  {activity.type && (
                    <Badge variant="outline" className={getBadgeVariant(activity.type)}>
                      {activity.type === 'payment' && 'pagamento'}
                      {activity.type === 'client' && 'cliente'}
                      {activity.type === 'sale' && 'venda'}
                      {activity.type === 'partner' && 'parceiro'}
                      {activity.type === 'system' && 'sistema'}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Nenhuma atividade recente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
