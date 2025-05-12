
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/use-notifications";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
} from "@/components/ui/card";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { Loader2, ArrowLeft } from "lucide-react";

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

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
  
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="container py-6 max-w-7xl">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={handleGoBack}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <PageHeader
          title="Notificações"
          description="Gerencie suas notificações do sistema"
        />
      </div>
      
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
            onClick={markAllAsRead}
            disabled={isLoading || notifications.every(n => n.read)}
          >
            Marcar todas como lidas
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive" 
            onClick={deleteAllNotifications}
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
