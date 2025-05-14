
import { useState } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationList } from "@/components/notifications/NotificationList";
import { NotificationFilters } from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/hooks/use-notifications";

// Tipos de filtro
type FilterType = "all" | "read" | "unread";
type StatusFilter = "all" | "read" | "unread";

const Notifications = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use o hook de notificações
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    markAsRead, 
    markAsUnread, 
    markAllAsRead, 
    deleteNotification,
    refresh // Uso da função refresh em vez de refreshNotifications
  } = useNotifications({
    statusFilter,
    typeFilter,
    searchTerm,
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    refresh(); // Usar refresh em vez de refreshNotifications
  };

  const handleMarkAsUnread = async (id: string) => {
    await markAsUnread(id);
    refresh(); // Usar refresh em vez de refreshNotifications
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refresh(); // Usar refresh em vez de refreshNotifications
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    refresh(); // Usar refresh em vez de refreshNotifications
  };

  // Funções de filtro
  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notificações" 
        description={`Gerencie suas notificações (${unreadCount} não lidas)`} 
      />
      
      <Card>
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b">
            <TabsList>
              <TabsTrigger value="all" onClick={() => handleStatusChange("all")}>
                Todas
              </TabsTrigger>
              <TabsTrigger value="unread" onClick={() => handleStatusChange("unread")}>
                Não lidas
              </TabsTrigger>
              <TabsTrigger value="read" onClick={() => handleStatusChange("read")}>
                Lidas
              </TabsTrigger>
            </TabsList>
            
            <NotificationFilters 
              onSearch={handleSearch}
              onTypeChange={handleTypeChange}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
          
          <TabsContent value="all" className="space-y-4">
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDelete}
            />
          </TabsContent>
          
          <TabsContent value="unread" className="space-y-4">
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDelete}
            />
          </TabsContent>
          
          <TabsContent value="read" className="space-y-4">
            <NotificationList
              notifications={notifications}
              isLoading={isLoading}
              onMarkAsRead={handleMarkAsRead}
              onMarkAsUnread={handleMarkAsUnread}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Notifications;
