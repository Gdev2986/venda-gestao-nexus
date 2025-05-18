
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationList from "@/components/notifications/NotificationList";
import NotificationFilters from "@/components/notifications/NotificationFilters";
import { useNotifications } from "@/contexts/NotificationsContext";
import { PageHeader } from "@/components/page/PageHeader";

const Notifications = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    isLoading = false,
    deleteNotification = () => Promise.resolve(),
    refreshNotifications = fetchNotifications
  } = useNotifications();

  useEffect(() => {
    // If refreshNotifications exists, use it, otherwise use fetchNotifications
    if (refreshNotifications) {
      refreshNotifications();
    } else {
      fetchNotifications();
    }
  }, [refreshNotifications, fetchNotifications]);

  return (
    <div className="container py-6">
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
              onMarkAllAsRead={markAllAsRead}
              onRefresh={refreshNotifications || fetchNotifications}
            />
          </CardHeader>
          <CardContent>
            <NotificationList 
              notifications={notifications}
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
