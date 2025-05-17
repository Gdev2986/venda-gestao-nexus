import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useNotifications from "@/hooks/useNotifications";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/types/enums";
import { Badge } from "@/components/ui/badge";
import { CheckIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const notificationTypeBadges: { [key in NotificationType]?: string } = {
  [NotificationType.SUPPORT]: "bg-sky-100 text-sky-500",
  [NotificationType.PAYMENT]: "bg-emerald-100 text-emerald-500",
  [NotificationType.BALANCE]: "bg-orange-100 text-orange-500",
  [NotificationType.MACHINE]: "bg-purple-100 text-purple-500",
  [NotificationType.COMMISSION]: "bg-yellow-100 text-yellow-500",
  [NotificationType.SYSTEM]: "bg-gray-100 text-gray-500",
  [NotificationType.GENERAL]: "bg-blue-100 text-blue-500",
  [NotificationType.SALE]: "bg-pink-100 text-pink-500",
  [NotificationType.BALANCE_UPDATE]: "bg-teal-100 text-teal-500",
  [NotificationType.PAYMENT_REQUEST]: "bg-lime-100 text-lime-500",
  [NotificationType.PAYMENT_APPROVED]: "bg-green-100 text-green-500",
  [NotificationType.PAYMENT_REJECTED]: "bg-red-100 text-red-500"
};

const NotificationDisplay = ({ notification, markAsRead }: {
  notification: any;
  markAsRead: (id: string) => void;
}) => {
  const [isRead, setIsRead] = useState(notification.is_read);

  const handleMarkAsRead = async () => {
    await markAsRead(notification.id);
    setIsRead(true);
  };

  return (
    <Card className="border-none shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {notification.title}
        </CardTitle>
        <Badge className={notificationTypeBadges[notification.type] || "bg-gray-100 text-gray-500"}>
          {notification.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {notification.message}
        </p>
        <div className="flex justify-between items-center mt-4">
          <time className="text-xs text-gray-500">
            {format(new Date(notification.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
          </time>
          {!isRead && (
            <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
              <CheckIcon className="h-4 w-4 mr-2" />
              Marcar como lida
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Update the Pagination component to use proper Pagination from UI components
const NotificationsPagination = ({ currentPage, totalPages, onPageChange }: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage <= 1}
            />
          </PaginationItem>
          
          {/* Show first page */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(1)}>
                1
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis if needed */}
          {currentPage > 3 && (
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Previous page if not first */}
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage - 1)}>
                {currentPage - 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Current page */}
          <PaginationItem>
            <PaginationLink isActive>
              {currentPage}
            </PaginationLink>
          </PaginationItem>
          
          {/* Next page if not last */}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(currentPage + 1)}>
                {currentPage + 1}
              </PaginationLink>
            </PaginationItem>
          )}
          
          {/* Ellipsis if needed */}
          {currentPage < totalPages - 2 && (
            <PaginationItem>
              <PaginationLink disabled>...</PaginationLink>
            </PaginationItem>
          )}
          
          {/* Last page if not already shown */}
          {currentPage < totalPages - 1 && totalPages > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => onPageChange(totalPages)}>
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage >= totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

const NotificationsPage = () => {
  const {
    notifications,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    markAsRead,
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p>Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p>Nenhuma notificação encontrada.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <NotificationDisplay
                  key={notification.id}
                  notification={notification}
                  markAsRead={markAsRead}
                />
              ))}
            </div>
          )}
          <NotificationsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          <Button onClick={refreshNotifications}>Refresh Notifications</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;
