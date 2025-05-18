
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatRelative } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNotifications } from "@/hooks/use-notifications";
import { Notification } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Notifications = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const formatRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return formatRelative(date, new Date(), { locale: ptBR });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (deletingId) {
      try {
        await deleteNotification(deletingId);
        toast({
          title: "Notificação excluída",
          description: "A notificação foi excluída com sucesso.",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro",
          description:
            error.message || "Não foi possível excluir a notificação.",
        });
      } finally {
        setShowDeleteAlert(false);
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Notificações</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} não lidas</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p>Nenhuma notificação encontrada.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.id}>
                    <TableCell>{notification.title}</TableCell>
                    <TableCell>{notification.message}</TableCell>
                    <TableCell>
                      {formatRelativeTime(notification.timestamp)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={notification.is_read ? "outline" : "default"}>
                        {notification.is_read ? "Lida" : "Não lida"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => markAsRead(notification.id)}
                            title="Marcar como lida"
                          >
                            <CheckCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDelete(notification.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza de que deseja excluir esta notificação? Esta ação não
              pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;
