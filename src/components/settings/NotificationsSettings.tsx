
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const NotificationsSettings = () => {
  const { toast } = useToast();
  
  const handleSavePreferences = () => {
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de Notificações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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
            <Switch id="payments-received" defaultChecked />
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
            <Switch id="payment-status" defaultChecked />
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
            <Switch id="admin-messages" defaultChecked />
          </div>
        </div>
        
        <Button onClick={handleSavePreferences}>
          Salvar preferências
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationsSettings;
