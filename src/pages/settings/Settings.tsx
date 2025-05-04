
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BellRing, Lock, User, UserCog, CreditCard } from "lucide-react";
import PixKeysManager from "@/components/settings/PixKeysManager";
import { useUserRole } from "@/hooks/use-user-role";
import { UserRole } from "@/types";
import { Link } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { userRole } = useUserRole();
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Configurações" 
        description="Gerencie suas preferências e configurações de conta"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
            <BellRing className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background">
            <Lock className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-background">
            <CreditCard className="h-4 w-4 mr-2" />
            Dados de Pagamento
          </TabsTrigger>
          {userRole === UserRole.ADMIN && (
            <TabsTrigger value="admin" className="data-[state=active]:bg-background">
              <UserCog className="h-4 w-4 mr-2" />
              Administração
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações de contato e perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input id="name" placeholder="Seu nome" defaultValue="João Silva" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao.silva@example.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(00) 00000-0000" defaultValue="(11) 98765-4321" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="000.000.000-00" defaultValue="123.456.789-00" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input id="company" placeholder="Nome da empresa" defaultValue="SigmaPay Ltda" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input id="cnpj" placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Alterações</Button>
              </CardFooter>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="notifications">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
                <CardDescription>
                  Configure como e quando você receberá notificações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações por Email</p>
                      <p className="text-sm text-muted-foreground">Receba alertas e atualizações do sistema por email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Pagamento</p>
                      <p className="text-sm text-muted-foreground">Seja notificado quando pagamentos forem processados</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Vendas</p>
                      <p className="text-sm text-muted-foreground">Receba alertas sobre novas vendas e atualizações</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Atualizações do Sistema</p>
                      <p className="text-sm text-muted-foreground">Seja notificado sobre novas funcionalidades</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Salvar Preferências</Button>
              </CardFooter>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="security">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                  Gerencie a segurança da sua conta e altere sua senha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input id="current-password" type="password" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nova Senha</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação de Dois Fatores</p>
                      <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança com 2FA</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificações de Login</p>
                      <p className="text-sm text-muted-foreground">Receba alertas quando sua conta for acessada</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Atualizar Senha</Button>
              </CardFooter>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        <TabsContent value="payment">
          <PageWrapper>
            <Card>
              <CardHeader>
                <CardTitle>Dados de Pagamento</CardTitle>
                <CardDescription>
                  Gerencie suas chaves PIX e preferências de pagamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <PixKeysManager />
              </CardContent>
            </Card>
          </PageWrapper>
        </TabsContent>
        
        {userRole === UserRole.ADMIN && (
          <TabsContent value="admin">
            <PageWrapper>
              <Card>
                <CardHeader>
                  <CardTitle>Administração do Sistema</CardTitle>
                  <CardDescription>
                    Acesse ferramentas e configurações administrativas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium mb-2">Gerenciamento de Usuários</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Gerencie usuários, funções e permissões do sistema
                      </p>
                      <Button variant="outline" asChild>
                        <Link to={PATHS.ADMIN.USER_MANAGEMENT}>
                          Gerenciar Usuários
                        </Link>
                      </Button>
                    </div>
                    <div className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                      <h3 className="font-medium mb-2">Configurações do Sistema</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Altere parâmetros gerais do sistema e configurações globais
                      </p>
                      <Button variant="outline">
                        Configurações Globais
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PageWrapper>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
