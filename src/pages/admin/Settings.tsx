import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import TablePagination from "@/components/ui/table-pagination";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string; // Changed to string to be compatible with both enum types
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  phone?: string;
  avatar?: string;
}

const Settings = () => {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch user profiles from Supabase
  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const { data, error, count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact' })
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Convert the data to ProfileData type
          const profilesData: ProfileData[] = data.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role,
            last_login: undefined, // We don't have this data from profiles table
            created_at: item.created_at,
            updated_at: item.updated_at,
            phone: item.phone,
            avatar: item.avatar
          }));
          
          setProfiles(profilesData);
          if (count !== null) {
            setTotalCount(count);
          }
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Falha ao carregar os perfis de usuários."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, [currentPage, toast]);

  // Handle role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update the local state to reflect the change
      setProfiles(prevProfiles =>
        prevProfiles.map(profile =>
          profile.id === userId ? { ...profile, role: newRole } : profile
        )
      );

      toast({
        title: "Função atualizada",
        description: `Função do usuário alterada para ${getRoleName(newRole)}`
      });
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Falha ao atualizar a função do usuário."
      });
    }
  };

  // Get role name in Portuguese
  const getRoleName = (role: string): string => {
    switch(role) {
      case "ADMIN":
        return "Administrador";
      case "FINANCIAL":
        return "Financeiro";
      case "LOGISTICS":
        return "Logística";
      case "PARTNER":
        return "Parceiro";
      case "CLIENT":
        return "Cliente";
      default:
        return role;
    }
  };

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Administrador</Badge>;
      case "FINANCIAL":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Financeiro</Badge>;
      case "LOGISTICS":
        return <Badge className="bg-green-500 hover:bg-green-600">Logística</Badge>;
      case "PARTNER":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Parceiro</Badge>;
      case "CLIENT":
        return <Badge className="bg-gray-500 hover:bg-gray-600">Cliente</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Simulated save handlers
  const handleSaveSystem = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do sistema foram atualizadas com sucesso."
    });
  };

  const handleSaveNotification = () => {
    toast({
      title: "Notificações configuradas",
      description: "As configurações de notificação foram salvas com sucesso."
    });
  };

  const handleSendNotification = () => {
    toast({
      title: "Notificação enviada",
      description: "A notificação foi enviada com sucesso para os destinatários selecionados."
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Configurações de segurança salvas",
      description: "As configurações de segurança foram atualizadas com sucesso."
    });
  };

  return (
    
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Configurações do Administrador</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        {/* Usuários Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>
                Configure as permissões e funções dos usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuário</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função Atual</TableHead>
                          <TableHead>Data de Criação</TableHead>
                          <TableHead>Alterar Função</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {profiles.map((profile) => (
                          <TableRow key={profile.id}>
                            <TableCell className="font-medium">{profile.name}</TableCell>
                            <TableCell>{profile.email}</TableCell>
                            <TableCell>{getRoleBadge(profile.role)}</TableCell>
                            <TableCell>{formatDate(profile.created_at)}</TableCell>
                            <TableCell>
                              <Select 
                                value={profile.role} 
                                onValueChange={(value) => handleRoleChange(profile.id, value)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Selecionar função" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ADMIN">Administrador</SelectItem>
                                  <SelectItem value="FINANCIAL">Financeiro</SelectItem>
                                  <SelectItem value="LOGISTICS">Logística</SelectItem>
                                  <SelectItem value="PARTNER">Parceiro</SelectItem>
                                  <SelectItem value="CLIENT">Cliente</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-4">
                    <TablePagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sistema Tab */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardDescription>
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">Nome do Sistema</Label>
                  <Input id="system-name" defaultValue="SigmaPay" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-url">URL do Sistema</Label>
                  <Input id="system-url" defaultValue="https://app.sigmapay.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="system-email">Email de Contato</Label>
                  <Input id="system-email" defaultValue="contato@sigmapay.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="America/Sao_Paulo">
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Selecionar fuso horário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">América/São Paulo</SelectItem>
                      <SelectItem value="America/New_York">América/Nova York</SelectItem>
                      <SelectItem value="Europe/London">Europa/Londres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Modo de Manutenção</h3>
                    <p className="text-sm text-muted-foreground">Ativar modo de manutenção no sistema</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Logins Permitidos</h3>
                    <p className="text-sm text-muted-foreground">Permitir que usuários façam login durante manutenção</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button onClick={handleSaveSystem}>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notificações Tab */}
        <TabsContent value="notifications">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Enviar Notificação</CardTitle>
                <CardDescription>
                  Envie comunicados e avisos para usuários do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notification-title">Título</Label>
                  <Input id="notification-title" placeholder="Digite o título da notificação" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-content">Conteúdo</Label>
                  <textarea 
                    id="notification-content" 
                    placeholder="Digite o conteúdo da notificação"
                    className="w-full min-h-32 p-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notification-recipients">Destinatários</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="notification-recipients">
                      <SelectValue placeholder="Selecione os destinatários" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os usuários</SelectItem>
                      <SelectItem value="clients">Somente clientes</SelectItem>
                      <SelectItem value="partners">Somente parceiros</SelectItem>
                      <SelectItem value="admin">Somente administradores</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enviar como prioritária</h3>
                    <p className="text-sm text-muted-foreground">A notificação será destacada para os usuários</p>
                  </div>
                  <Switch />
                </div>
                <Button onClick={handleSendNotification}>Enviar Notificação</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Configurar Notificações</CardTitle>
                <CardDescription>
                  Configure as notificações automáticas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações de Pagamento</h3>
                      <p className="text-sm text-muted-foreground">Enviar notificações de pagamentos</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações de Novos Usuários</h3>
                      <p className="text-sm text-muted-foreground">Avisar sobre registro de novos usuários</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Alertas de Sistema</h3>
                      <p className="text-sm text-muted-foreground">Enviar alertas sobre eventos do sistema</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Notificações por Email</h3>
                      <p className="text-sm text-muted-foreground">Encaminhar notificações como email</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <Button onClick={handleSaveNotification}>Salvar Configurações</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Segurança Tab - Only change password */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Senha</CardTitle>
              <CardDescription>
                Altere sua senha de acesso ao sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input type="password" id="currentPassword" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input type="password" id="newPassword" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                  <Input type="password" id="confirmPassword" />
                </div>
              </div>
              
              <Button onClick={handleSaveSecurity}>Salvar Nova Senha</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
