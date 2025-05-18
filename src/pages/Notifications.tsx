
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Loader2, ArrowLeft } from "lucide-react";

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNotifications, setFilteredNotifications] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    refreshNotifications
  } = useNotifications();

  // Aplicar filtros e paginação
  useEffect(() => {
    // Filtrar notificações
    let filtered = [...notifications];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(notification => 
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term)
      );
    }
    
    if (typeFilter !== "all") {
      filtered = filtered.filter(notification => notification.type === typeFilter);
    }
    
    if (statusFilter === "read") {
      filtered = filtered.filter(notification => notification.read);
    } else if (statusFilter === "unread") {
      filtered = filtered.filter(notification => !notification.read);
    }
    
    // Calcular paginação
    const pageSize = 10;
    const total = filtered.length;
    const maxPages = Math.ceil(total / pageSize);
    setTotalPages(maxPages || 1);
    
    // Aplicar paginação
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedNotifications = filtered.slice(startIndex, startIndex + pageSize);
    
    setFilteredNotifications(paginatedNotifications);
  }, [notifications, searchTerm, typeFilter, statusFilter, currentPage]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset para primeira página ao pesquisar
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
      // Como o contexto não tem método para excluir todas, fazemos uma por uma
      const promises = notifications.map(n => deleteNotification(n.id));
      await Promise.all(promises);
      
      toast({
        title: "Sucesso",
        description: "Todas as notificações foram excluídas",
      });
    }
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
            onClick={handleMarkAllAsRead}
            disabled={loading || notifications.every(n => n.read)}
          >
            Marcar todas como lidas
          </Button>
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive" 
            onClick={handleDeleteAll}
            disabled={loading || notifications.length === 0}
          >
            Excluir todas
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <NotificationList 
              notifications={filteredNotifications} 
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
