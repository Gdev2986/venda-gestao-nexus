
import React, { useEffect } from "react";
import { NotificationList } from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/contexts/notifications/NotificationsContext";
import { PageHeader } from "@/components/page/PageHeader";
import { useState } from "react";
import { StyledCard } from "@/components/ui/styled-card";
import { Bell } from "lucide-react";

const Notifications = () => {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const {
    notifications,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  // Filter notifications based on filters
  const filteredNotifications = notifications.filter(notification => {
    if (typeFilter !== 'all' && notification.type.toLowerCase() !== typeFilter.toLowerCase()) {
      return false;
    }
    
    if (statusFilter === 'read' && !notification.is_read) {
      return false;
    }
    if (statusFilter === 'unread' && notification.is_read) {
      return false;
    }
    
    return true;
  });

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
            onRefresh={() => {}}
          />
        </div>
        <NotificationList 
          notifications={filteredNotifications}
          onMarkAsRead={markAsRead}
          isLoading={false}
        />
      </StyledCard>
    </div>
  );
};

export default Notifications;
