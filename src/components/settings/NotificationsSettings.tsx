
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface NotificationPreferences {
  id?: string;
  payments_received: boolean;
  payment_status_updates: boolean;
  admin_messages: boolean;
}

const NotificationsSettings = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    payments_received: true,
    payment_status_updates: true,
    admin_messages: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data) {
          setPreferences({
            id: data.id,
            payments_received: data.payments_received,
            payment_status_updates: data.payment_status_updates,
            admin_messages: data.admin_messages,
          });
        }
      } catch (error) {
        console.error('Erro ao buscar preferências:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar suas preferências de notificação",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPreferences();
  }, [user]);

  const handleSavePreferences = async () => {
    if (!user) return;
    
    setSaving(true);
    
    try {
      // Verificar se já existe uma preferência para este usuário
      if (preferences.id) {
        // Atualizar preferência existente
        const { error } = await supabase
          .from('notification_preferences')
          .update({
            payments_received: preferences.payments_received,
            payment_status_updates: preferences.payment_status_updates,
            admin_messages: preferences.admin_messages,
          })
          .eq('id', preferences.id);
        
        if (error) throw error;
      } else {
        // Criar nova preferência
        const { data, error } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: user.id,
            payments_received: preferences.payments_received,
            payment_status_updates: preferences.payment_status_updates,
            admin_messages: preferences.admin_messages,
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setPreferences(prev => ({
            ...prev,
            id: data[0].id,
          }));
        }
      }
      
      toast({
        title: "Preferências salvas",
        description: "Suas preferências de notificação foram atualizadas com sucesso",
      });
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar suas preferências de notificação",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificação</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="payments-received" className="text-base font-medium">
              Pagamentos Recebidos
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações quando novos pagamentos forem processados
            </p>
          </div>
          <Switch 
            id="payments-received"
            checked={preferences.payments_received}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, payments_received: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="payment-status" className="text-base font-medium">
              Atualizações de Status
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações quando o status de seus pagamentos for alterado
            </p>
          </div>
          <Switch 
            id="payment-status"
            checked={preferences.payment_status_updates}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, payment_status_updates: checked }))
            }
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="admin-messages" className="text-base font-medium">
              Mensagens Administrativas
            </Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações sobre anúncios importantes e atualizações do sistema
            </p>
          </div>
          <Switch 
            id="admin-messages"
            checked={preferences.admin_messages}
            onCheckedChange={(checked) => 
              setPreferences(prev => ({ ...prev, admin_messages: checked }))
            }
          />
        </div>
        
        <Button 
          onClick={handleSavePreferences} 
          disabled={saving}
          className="mt-4"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar Preferências"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
