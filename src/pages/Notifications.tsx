
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotificationList } from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/contexts/NotificationsContext";
import { PageHeader } from "@/components/page/PageHeader";
import { useState } from "react";
import { NotificationType } from "@/types";

const Notifications = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    isLoading,
    deleteNotification,
    refreshNotifications = fetchNotifications
  } = useNotifications();

  // Garantir que as notificações são carregadas ao montar o componente
  useEffect(() => {
    console.log("Carregando notificações...");
    refreshNotifications();
  }, [refreshNotifications]);

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

  return (
    <div className="py-6">
      <PageHeader
        title="Notificações"
        description="Gerencie suas notificações"
      />

      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="flex-1">
              <CardTitle>Suas Notificações</CardTitle>
            </div>
            <NotificationFilters 
              typeFilter={typeFilter}
              statusFilter={statusFilter}
              onTypeChange={setTypeFilter}
              onStatusChange={setStatusFilter}
              onMarkAllAsRead={markAllAsRead}
              onRefresh={refreshNotifications}
            />
          </CardHeader>
          <CardContent>
            <NotificationList 
              notifications={filteredNotifications}
              onMarkAsRead={markAsRead}
              isLoading={isLoading}
              onDelete={deleteNotification}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
