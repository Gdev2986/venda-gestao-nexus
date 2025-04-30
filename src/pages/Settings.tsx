
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import PixKeysManager from "@/components/settings/PixKeysManager";
import { UserRole } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CameraIcon, Users, RefreshCw } from "lucide-react";
import { useUserRole } from "@/hooks/use-user-role";
import { PATHS } from "@/routes/paths";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const { userRole } = useUserRole();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [pixKeys, setPixKeys] = useState([
    {
      id: "1",
      user_id: "user_1",
      key_type: "CPF",
      type: "CPF",
      key: "123.456.789-00",
      owner_name: "Minha chave principal",
      name: "Minha chave principal",
      isDefault: true,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bank_name: "Banco"
    },
    {
      id: "2",
      user_id: "user_1",
      key_type: "EMAIL",
      type: "EMAIL",
      key: "email@exemplo.com",
      owner_name: "Email pessoal",
      name: "Email pessoal",
      isDefault: false,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      bank_name: "Banco"
    },
  ]);
  
  const handleAddPixKey = (key: Partial<any>) => {
    const newKey = {
      ...key,
      id: `key_${Math.random().toString(36).slice(2, 11)}`, // Generate random id
      user_id: "user_1",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setPixKeys((prev) => [...prev, newKey]);
  };
  
  const handleDeletePixKey = (keyId: string) => {
    setPixKeys((prev) => prev.filter((key) => key.id !== keyId));
  };
  
  const handleSetDefaultPixKey = (keyId: string) => {
    setPixKeys((prev) =>
      prev.map((key) => ({
        ...key,
        isDefault: key.id === keyId,
      }))
    );
  };

  const goToUserManagement = () => {
    navigate(PATHS.USER_MANAGEMENT);
  };
  
  const handleRefreshData = () => {
    setIsRefreshing(true);
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Dados atualizados",
        description: "Seus dados foram atualizados com sucesso"
      });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie seu perfil e preferências da conta
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 sm:mt-0 flex items-center gap-1"
          onClick={handleRefreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? "Atualizando..." : "Atualizar dados"}
        </Button>
      </div>
      
      {userRole === UserRole.ADMIN && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Administração do Sistema</CardTitle>
              <CardDescription>
                Acesso às ferramentas de administração do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={goToUserManagement}
                className="flex items-center gap-2"
              >
                <Users className="h-5 w-5" />
                Gerenciar Usuários
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="pix">Chaves Pix</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center overflow-hidden border-2 border-border">
                      <span className="text-2xl font-bold">JS</span>
                    </div>
                    <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8">
                      <CameraIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="w-full">
                    <p className="text-sm text-muted-foreground mb-2">
                      Sua foto será exibida no perfil e em outras áreas do sistema.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm">Trocar Foto</Button>
                      <Button variant="outline" size="sm">Remover</Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="João Silva" defaultValue="João Silva" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" placeholder="seuemail@exemplo.com" defaultValue="joao@exemplo.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(00) 00000-0000" defaultValue="(11) 98765-4321" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="document">CPF/CNPJ</Label>
                    <Input id="document" placeholder="000.000.000-00" defaultValue="123.456.789-00" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pix">
            <PixKeysManager
              pixKeys={pixKeys}
              onAddKey={handleAddPixKey}
              onDeleteKey={handleDeletePixKey}
              onSetDefaultKey={handleSetDefaultPixKey}
            />
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>
                  Atualize suas configurações de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <div className="flex justify-end">
                  <Button>Alterar Senha</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
