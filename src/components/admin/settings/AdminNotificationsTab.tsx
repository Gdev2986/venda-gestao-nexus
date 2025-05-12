import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { UserRole } from "@/types";

const AdminNotificationsTab = () => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [targetRole, setTargetRole] = useState<UserRole | "all">("all");
  const [frequency, setFrequency] = useState("immediate");

  const handleTargetChange = (value: string) => {
    // Convert string to UserRole type before setting it
    const roleValue = value === "all" ? "all" : value as UserRole;
    setTargetRole(roleValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Configure como as notificações são enviadas e recebidas no sistema.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Notificações por Email</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações importantes por email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={emailEnabled}
            onCheckedChange={setEmailEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="push-notifications">Notificações Push</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações em tempo real no navegador
            </p>
          </div>
          <Switch
            id="push-notifications"
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sms-notifications">Notificações por SMS</Label>
            <p className="text-sm text-muted-foreground">
              Receba alertas importantes por SMS (podem ser aplicadas taxas)
            </p>
          </div>
          <Switch
            id="sms-notifications"
            checked={smsEnabled}
            onCheckedChange={setSmsEnabled}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="notification-frequency">Frequência de Notificações</Label>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger id="notification-frequency">
              <SelectValue placeholder="Selecione a frequência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Imediato</SelectItem>
              <SelectItem value="hourly">Resumo por hora</SelectItem>
              <SelectItem value="daily">Resumo diário</SelectItem>
              <SelectItem value="weekly">Resumo semanal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="notification-target">Perfil Padrão para Notificações</Label>
          <Select onValueChange={handleTargetChange} value={targetRole}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
              <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
              <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email-template">Template de Email</Label>
          <Textarea
            id="email-template"
            placeholder="Template HTML para emails de notificação"
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="notification-webhook">Webhook URL</Label>
          <Input
            id="notification-webhook"
            placeholder="https://seu-webhook.com/notifications"
          />
          <p className="text-xs text-muted-foreground mt-1">
            URL para receber notificações via webhook
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="outline" className="mr-2">
          Cancelar
        </Button>
        <Button>Salvar Configurações</Button>
      </div>
    </div>
  );
};

export default AdminNotificationsTab;
