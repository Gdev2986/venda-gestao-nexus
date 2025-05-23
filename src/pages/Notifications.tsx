import React, { useEffect } from "react";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/hooks/use-notifications";
import { PageHeader } from "@/components/page/PageHeader";
import { useState } from "react";
import { StyledCard } from "@/components/ui/styled-card";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    isLoading,
    deleteNotification,
    refreshNotifications = fetchNotifications
  } = useNotifications();

  // Garantir que as notificações são carregadas apenas uma vez ao montar o componente
  useEffect(() => {
    if (isFirstLoad) {
      console.log("Carregando notificações...");
      refreshNotifications();
      setIsFirstLoad(false);
    }
  }, [refreshNotifications, isFirstLoad]);

  // Filtrar notificações baseado nos filtros atuais
  const filteredNotifications = notifications.filter(notification => {
    // Filtrar por tipo
    if (typeFilter !== 'all' && notification.type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    
    // Filtrar por status
    if (statusFilter === 'read' && !notification.is_read) {
      return false;
    }
    if (statusFilter === 'unread' && notification.is_read) {
      return false;
    }
    
    return true;
  });

  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 py-6">
      <PageHeader
        title="Notificações"
        description="Gerencie suas notificações"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StyledCard 
          title="Notificações" 
          icon={<Bell className="h-4 w-4 text-primary" />}
          borderColor="border-primary"
        >
          <div className="text-2xl font-bold">{notifications.length}</div>
          <p className="text-sm text-muted-foreground">Total de notificações</p>
        </StyledCard>
        
        <StyledCard 
          title="Não Lidas" 
          icon={<Bell className="h-4 w-4 text-orange-500" />}
          borderColor="border-orange-500"
        >
          <div className="text-2xl font-bold">{unreadCount}</div>
          <p className="text-sm text-muted-foreground">Notificações não lidas</p>
        </StyledCard>
        
        <StyledCard 
          title="Lidas" 
          icon={<Bell className="h-4 w-4 text-green-500" />}
          borderColor="border-green-500"
        >
          <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
          <p className="text-sm text-muted-foreground">Notificações lidas</p>
        </StyledCard>
      </div>

      <StyledCard 
        borderColor="border-gray-200"
        title="Suas Notificações"
      >
        <div className="mb-4">
          <NotificationFilters 
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            onTypeChange={setTypeFilter}
            onStatusChange={setStatusFilter}
            onMarkAllAsRead={markAllAsRead}
            onRefresh={refreshNotifications}
          />
        </div>
        <NotificationList 
          notifications={filteredNotifications}
          onMarkAsRead={markAsRead}
          isLoading={isLoading}
          onDelete={deleteNotification}
        />
      </StyledCard>
    </div>
  );
};

export default Notifications;
