
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { Loader2 } from "lucide-react";

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    totalPages,
    refreshNotifications
  } = useNotifications({
    searchTerm,
    typeFilter,
    statusFilter,
    page: currentPage
  });
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };
  
  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast({
      title: "Sucesso",
      description: "Todas as notificações foram marcadas como lidas",
    });
  };
  
  const handleDeleteAll = async () => {
    if (confirm("Tem certeza que deseja excluir todas as notificações?")) {
      await deleteAllNotifications();
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram excluídas",
      });
    }
  };

  return (
    <div className="container py-6 max-w-7xl">
      <PageHeader
        title="Notificações"
        description="Gerencie suas notificações do sistema"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por palavra-chave..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full"
          />
        </div>
        
        <NotificationFilters
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onTypeChange={setTypeFilter}
          onStatusChange={setStatusFilter}
        />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={isLoading || notifications.every(n => n.read)}
          >
            Marcar todas como lidas
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive" 
            onClick={handleDeleteAll}
            disabled={isLoading || notifications.length === 0}
          >
            Excluir todas
          </Button>
        </div>
      </div>
      
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
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
