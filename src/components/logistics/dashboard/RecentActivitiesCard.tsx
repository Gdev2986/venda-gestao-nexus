
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Export the Activity interface so it can be imported elsewhere
export interface Activity {
  id: number;
  description: string;
  timestamp: string;
}

interface RecentActivitiesCardProps {
  activities: Activity[];
}

const RecentActivitiesCard: React.FC<RecentActivitiesCardProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Últimas Atividades</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[350px] overflow-auto">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
              <p className="text-sm">{activity.description}</p>
              <span className="text-xs text-muted-foreground mt-1 block">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesCard;
