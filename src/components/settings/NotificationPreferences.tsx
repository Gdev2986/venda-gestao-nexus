
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

export function NotificationPreferences() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  
  // Fetch notification preferences
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows found" error, which we handle by creating default preferences
          throw error;
        }
        
        if (data) {
          setPreferences(data);
        } else {
          // Create default preferences if none exist
          const defaultPreferences = {
            user_id: user.id,
            payments_received: true,
            payment_status_updates: true,
            admin_messages: true,
          };
          
          const { data: newData, error: insertError } = await supabase
            .from('notification_preferences')
            .insert(defaultPreferences)
            .select();
            
          if (insertError) throw insertError;
          
          if (newData && newData.length > 0) {
            setPreferences(newData[0]);
          }
        }
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
  const handleTogglePreference = async (field: keyof NotificationPreference, value: boolean) => {
    if (!preferences || !user) return;
    
    try {
      // Update state optimistically
      setPreferences({
        ...preferences,
        [field]: value,
      });
      
      // Update in database
      const { error } = await supabase
        .from('notification_preferences')
        .update({ [field]: value, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
        
      if (error) throw error;
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
      const { error } = await supabase
        .from('notification_preferences')
        .update({
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
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
