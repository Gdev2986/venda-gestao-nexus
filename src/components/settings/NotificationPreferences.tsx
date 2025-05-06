
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type NotificationPreference = {
  id: string;
  user_id: string;
  payments_received: boolean;
  payment_status_updates: boolean;
  admin_messages: boolean;
  created_at: string;
  updated_at: string;
};

// Mock data for initial development until the table is created
const defaultPreferences: Omit<NotificationPreference, 'id' | 'created_at' | 'updated_at'> = {
  user_id: '',
  payments_received: true,
  payment_status_updates: true,
  admin_messages: true,
};

export function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  
  // Fetch or initialize notification preferences
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // For now, initialize with default preferences until the table is created
        setPreferences({
          id: `temp-${user.id}`,
          user_id: user.id,
          ...defaultPreferences,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        
        // Note: The actual database query will be implemented once the notification_preferences table exists
        
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar preferências",
          description: "Não foi possível carregar suas preferências de notificação."
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotificationPreferences();
  }, [user, toast]);

  // Handle preference toggle
  const handleTogglePreference = async (field: keyof Omit<NotificationPreference, 'id' | 'user_id' | 'created_at' | 'updated_at'>, value: boolean) => {
    if (!preferences || !user) return;
    
    try {
      // Update state optimistically
      setPreferences({
        ...preferences,
        [field]: value,
      });
      
      // Note: The actual database update will be implemented once the notification_preferences table exists
      // For now, just log the change
      console.log(`Updated preference ${field} to ${value} for user ${user.id}`);
      
    } catch (error) {
      console.error('Error updating notification preference:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar preferência",
        description: "Não foi possível atualizar sua preferência de notificação."
      });
      
      // Revert state on error
      if (preferences) {
        setPreferences({
          ...preferences,
          [field]: !value,
        });
      }
    }
  };

  // Save all preferences
  const handleSavePreferences = async () => {
    if (!preferences || !user) return;
    
    try {
      // Note: The actual database update will be implemented once the notification_preferences table exists
      // For now, just log the preferences
      console.log('Saving preferences:', preferences);
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram salvas com sucesso."
      });
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas preferências de notificação."
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando preferências...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between px-4 py-3 border rounded-md">
          <div>
            <Label htmlFor="payments-received" className="font-medium">
              Pagamentos recebidos
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações quando novos pagamentos forem confirmados
            </p>
          </div>
          <Switch
            id="payments-received"
            checked={preferences?.payments_received}
            onCheckedChange={(value) => handleTogglePreference('payments_received', value)}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 border rounded-md">
          <div>
            <Label htmlFor="payment-status" className="font-medium">
              Status de solicitações
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações sobre mudanças de status em suas solicitações de pagamento
            </p>
          </div>
          <Switch
            id="payment-status"
            checked={preferences?.payment_status_updates}
            onCheckedChange={(value) => handleTogglePreference('payment_status_updates', value)}
          />
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 border rounded-md">
          <div>
            <Label htmlFor="admin-messages" className="font-medium">
              Mensagens da administração
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações sobre mensagens importantes da administração
            </p>
          </div>
          <Switch
            id="admin-messages"
            checked={preferences?.admin_messages}
            onCheckedChange={(value) => handleTogglePreference('admin_messages', value)}
          />
        </div>
      </div>
      
      <Button onClick={handleSavePreferences}>
        Salvar preferências
      </Button>
    </div>
  );
}
