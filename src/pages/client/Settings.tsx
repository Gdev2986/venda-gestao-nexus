
import React from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { User, Bell, Lock, CreditCard } from "lucide-react";

const ClientSettings = () => {
  const { user, profile } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações"
        description="Gerencie suas preferências e configurações da conta"
      />
      
      <div className="grid gap-6">
        {/* Perfil */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Informações do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue={profile?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user?.email || ""} disabled />
              </div>
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-600" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Pagamento</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações sobre aprovações e rejeições de pagamento
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Vendas</Label>
                <p className="text-sm text-muted-foreground">
                  Receba resumos diários das suas vendas
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações de Suporte</Label>
                <p className="text-sm text-muted-foreground">
                  Receba atualizações sobre seus chamados de suporte
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">
              Alterar Senha
            </Button>
            <Separator />
            <Button variant="outline">
              Configurar Autenticação em Duas Etapas
            </Button>
          </CardContent>
        </Card>

        {/* Chaves PIX */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Chaves PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gerencie suas chaves PIX para recebimento de pagamentos
            </p>
            <Button variant="outline">
              Gerenciar Chaves PIX
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientSettings;
