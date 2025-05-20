
import React, { useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/contexts/notifications/NotificationsProvider";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Notification } from "@/contexts/notifications/types";

export default function NotificationsPage() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  const readNotifications = notifications.filter((notification) => notification.read);
  const unreadNotifications = notifications.filter((notification) => !notification.read);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notificações" 
        description="Gerencie suas notificações do sistema"
      />

      <div className="flex items-center justify-between">
        <Tabs defaultValue="unread" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="unread">
                Não lidas ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read">
                Lidas ({readNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Todas ({notifications.length})
              </TabsTrigger>
            </TabsList>

            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={() => markAllAsRead()}
                disabled={unreadNotifications.length === 0}
              >
                Marcar todas como lidas
              </Button>
            </div>
          </div>

          <TabsContent value="unread">
            <Card>
              {unreadNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Não há notificações não lidas.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {unreadNotifications.map((notification: Notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="read">
            <Card>
              {readNotifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Não há notificações lidas.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {readNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  Não há notificações.
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                    />
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
