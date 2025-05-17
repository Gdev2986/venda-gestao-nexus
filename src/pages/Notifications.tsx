
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { PageHeader } from "@/components/page/PageHeader";
import { Pagination } from "@/components/ui/pagination";

const Notifications = () => {
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const { 
    notifications, 
    loading, 
    totalPages, 
    markAsRead, 
    markAsUnread 
  } = useNotifications(filter, page);
  
  // Reset page to 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);
  
  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Notificações"
        description="Gerencie suas notificações"
      />
      
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-xl">Suas Notificações</CardTitle>
            <NotificationFilters
              filter={filter}
              setFilter={setFilter}
              isLoading={loading}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAsUnread={markAsUnread}
            isLoading={loading}
          />
          
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
