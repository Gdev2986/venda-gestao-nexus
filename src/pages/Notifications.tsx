import { useState, useEffect } from "react";
import { Bell, Check, Trash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNotifications } from "@/hooks/use-notifications";
import { Badge } from "@/components/ui/badge";
import { Notification, NotificationType } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, isLoading, markAsUnread } = useNotifications();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  useEffect(() => {
    document.title = "Notificações | SigmaPay";
  }, []);

  const filterByDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
  
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.PAYMENT:
        return <CreditCard className="h-4 w-4" />;
      case NotificationType.BALANCE:
        return <Wallet className="h-4 w-4" />;
      case NotificationType.MACHINE:
        return <Laptop className="h-4 w-4" />;
      case NotificationType.COMMISSION:
        return <LucideTrendingUp className="h-4 w-4" />;
      case NotificationType.SYSTEM:
        return <Settings className="h-4 w-4" />;
      case NotificationType.GENERAL:
        return <MessageSquare className="h-4 w-4" />;
      case NotificationType.SALE:
        return <ShoppingCart className="h-4 w-4" />;
      case NotificationType.SUPPORT:
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
          <p className="text-muted-foreground">
            Receba atualizações sobre pagamentos, vendas e outras atividades importantes.
          </p>
        </div>
        {notifications.length > 0 && (
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/6" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Você não tem notificações. Quando houver novidades, elas aparecerão aqui.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`overflow-hidden transition-all hover:shadow-md ${
                !notification.is_read ? "border-l-4 border-l-primary" : ""
              }`}
            >
              <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                <div className="flex gap-2 items-center">
                  <div className="bg-primary/10 p-2 rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      {notification.title}
                      {!notification.is_read && (
                        <Badge variant="default" className="h-1.5 w-1.5 rounded-full p-0 bg-primary" />
                      )}
                    </CardTitle>
                    <CardDescription>
                      {formatDistanceToNow(new Date(notification.timestamp), { 
                        addSuffix: true,
                        locale: ptBR
                      })}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (notification.is_read) {
                        markAsUnread(notification.id);
                      } else {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <Check className="h-4 w-4" />
                    <span className="sr-only">
                      {notification.is_read ? "Marcar como não lida" : "Marcar como lida"}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedNotification(notification);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Excluir notificação</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm">{notification.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir notificação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta notificação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (selectedNotification) {
                  await deleteNotification(selectedNotification.id);
                  setIsDeleteDialogOpen(false);
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationsPage;

import {
  CreditCard,
  Wallet,
  Laptop,
  TrendingUp as LucideTrendingUp,
  Settings,
  MessageSquare,
  ShoppingCart,
  HelpCircle,
} from "lucide-react";
