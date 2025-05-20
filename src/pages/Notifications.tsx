
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Notification } from "@/contexts/notifications/types";
import { format } from "date-fns";

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching notifications:', error);
        } else {
          setNotifications(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
        
      if (error) {
        console.error('Error marking notifications as read:', error);
      } else {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, is_read: true }))
        );
      }
    } catch (err) {
      console.error('Failed to mark notifications as read:', err);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) {
        console.error(`Error marking notification ${id} as read:`, error);
      } else {
        // Update local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === id ? { ...notif, is_read: true } : notif
          )
        );
      }
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };

  const getFilteredNotifications = (type: 'all' | 'unread') => {
    if (type === 'all') return notifications;
    return notifications.filter(n => !n.is_read);
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notificações</h1>
        <Button onClick={markAllAsRead} variant="outline">
          Marcar todas como lidas
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="unread">Não lidas</TabsTrigger>
        </TabsList>
        
        {['all', 'unread'].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>
                  {tabValue === 'all' ? 'Todas as notificações' : 'Notificações não lidas'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-4">Carregando notificações...</div>
                ) : getFilteredNotifications(tabValue as 'all' | 'unread').length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    Nenhuma notificação encontrada.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredNotifications(tabValue as 'all' | 'unread').map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${
                          !notification.is_read ? 'bg-muted/30' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(notification.created_at)}
                          </div>
                        </div>
                        <p className="text-sm mb-3">{notification.message}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                getTypeColor(notification.type)
                              }`}
                            >
                              {getTypeLabel(notification.type)}
                            </span>
                          </div>
                          {!notification.is_read && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Marcar como lida
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

// Helper functions for notification styling
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    PAYMENT: 'bg-green-100 text-green-800',
    BALANCE: 'bg-blue-100 text-blue-800',
    SYSTEM: 'bg-purple-100 text-purple-800',
    MACHINE: 'bg-orange-100 text-orange-800',
    GENERAL: 'bg-gray-100 text-gray-800',
    SUPPORT: 'bg-amber-100 text-amber-800',
  };
  
  return colors[type] || colors.GENERAL;
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    PAYMENT: 'Pagamento',
    BALANCE: 'Saldo',
    SYSTEM: 'Sistema',
    MACHINE: 'Máquina',
    COMMISSION: 'Comissão',
    GENERAL: 'Geral',
    SALE: 'Venda',
    SUPPORT: 'Suporte',
  };
  
  return labels[type] || 'Geral';
}

export default NotificationsPage;
