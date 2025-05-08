
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

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin?: string;
}

const Settings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("users");
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch mock users
  useEffect(() => {
    const fetchUsers = () => {
      setIsLoading(true);
      // Mock data
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: UserRole.ADMIN,
          lastLogin: "2023-10-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: UserRole.FINANCIAL,
          lastLogin: "2023-10-14T15:45:00Z",
        },
        {
          id: "3",
          name: "Alan Jackson",
          email: "alan@example.com",
          role: UserRole.LOGISTICS,
          lastLogin: "2023-10-13T09:20:00Z",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-12T12:10:00Z",
        },
        {
          id: "5",
          name: "Michael Brown",
          email: "michael@example.com",
          role: UserRole.PARTNER,
          lastLogin: "2023-10-11T16:30:00Z",
        },
        {
          id: "6",
          name: "Lisa Taylor",
          email: "lisa@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-10T14:25:00Z",
        },
        {
          id: "7",
          name: "David Miller",
          email: "david@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-09T11:15:00Z",
        },
        {
          id: "8",
          name: "Emma Wilson",
          email: "emma@example.com",
          role: UserRole.PARTNER,
          lastLogin: "2023-10-08T09:45:00Z",
        },
        {
          id: "9",
          name: "Robert Johnson",
          email: "robert@example.com",
          role: UserRole.LOGISTICS,
          lastLogin: "2023-10-07T10:50:00Z",
        },
        {
          id: "10",
          name: "Olivia Davis",
          email: "olivia@example.com",
          role: UserRole.FINANCIAL,
          lastLogin: "2023-10-06T13:40:00Z",
        },
        {
          id: "11",
          name: "William Garcia",
          email: "william@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-05T16:20:00Z",
        },
        {
          id: "12",
          name: "Sophia Martinez",
          email: "sophia@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-04T15:10:00Z",
        },
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    const validRole = newRole as UserRole;
    
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: validRole } : user
      )
    );

    toast({
      title: "Função atualizada",
      description: `Função do usuário alterada para ${getRoleName(validRole)}`
    });
  };

  // Get role name in Portuguese
  const getRoleName = (role: UserRole): string => {
    switch(role) {
      case UserRole.ADMIN:
        return "Administrador";
      case UserRole.FINANCIAL:
        return "Financeiro";
      case UserRole.LOGISTICS:
        return "Logística";
      case UserRole.PARTNER:
        return "Parceiro";
      case UserRole.CLIENT:
        return "Cliente";
      default:
        return role;
    }
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge className="bg-purple-500 hover:bg-purple-600">Administrador</Badge>;
      case UserRole.FINANCIAL:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Financeiro</Badge>;
      case UserRole.LOGISTICS:
        return <Badge className="bg-green-500 hover:bg-green-600">Logística</Badge>;
      case UserRole.PARTNER:
        return <Badge className="bg-amber-500 hover:bg-amber-600">Parceiro</Badge>;
      case UserRole.CLIENT:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Cliente</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                          <TableHead>Último Acesso</TableHead>
                          <TableHead>Alterar Função</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                            <TableCell>{formatDate(user.lastLogin)}</TableCell>
                            <TableCell>
                              <Select 
                                value={user.role} 
                                onValueChange={(value) => handleRoleChange(user.id, value)}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Selecionar função" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                                  <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                                  <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
                                  <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                                  <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
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
        
        {/* Segurança Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Política de Senha</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Selecionar política" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básica (min. 6 caracteres)</SelectItem>
                      <SelectItem value="medium">Média (min. 8 chars, letras e números)</SelectItem>
                      <SelectItem value="strong">Forte (min. 10 chars, letras, números e símbolos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Expiração da Senha</Label>
                  <Select defaultValue="90">
                    <SelectTrigger id="password-expiry">
                      <SelectValue placeholder="Selecionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Nunca</SelectItem>
                      <SelectItem value="30">30 dias</SelectItem>
                      <SelectItem value="60">60 dias</SelectItem>
                      <SelectItem value="90">90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Autenticação em Dois Fatores</h3>
                    <p className="text-sm text-muted-foreground">Exigir 2FA para todos os usuários</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Bloqueio após tentativas</h3>
                    <p className="text-sm text-muted-foreground">Bloquear conta após 5 tentativas falhas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Histórico de Senhas</h3>
                    <p className="text-sm text-muted-foreground">Impedir reutilização das últimas 5 senhas</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button onClick={handleSaveSystem}>Salvar Configurações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
