
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationSender } from "@/components/admin/notifications/NotificationSender";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationList from "@/components/notifications/NotificationList";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const AdminNotifications = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAsUnread, 
    markAllAsRead,
    deleteNotification,
    totalPages 
  } = useNotifications({
    page: currentPage
  });
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Central de Notificações" 
        description="Envie e gerencie notificações do sistema"
      />
      
      <Tabs defaultValue="send">
        <TabsList className="mb-6">
          <TabsTrigger value="send">Enviar Notificação</TabsTrigger>
          <TabsTrigger value="list">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="send">
          <NotificationSender />
        </TabsContent>
        
        <TabsContent value="list">
          <PageWrapper>
            <Card>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <NotificationList 
                    notifications={notifications} 
                    onMarkAsRead={markAsRead}
                    onMarkAsUnread={markAsUnread}
                    onDelete={deleteNotification}
                    currentPage={currentPage}
                    totalPages={totalPages || 1}
                    onPageChange={setCurrentPage}
                  />
                )}
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminNotifications;
