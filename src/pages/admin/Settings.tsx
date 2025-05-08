
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";
import { Separator } from "@/components/ui/separator";
import { PersonalDataForm } from "@/components/settings/PersonalDataForm";
import SecuritySettings from "@/components/settings/SecuritySettings";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState as useStateInner } from "react";
import { supabase } from "@/integrations/supabase/client";

// User profile type definition
interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

// Notification type
interface NotificationSettings {
  title: string;
  message: string;
  recipients: 'ALL' | 'CLIENTS' | 'PARTNERS' | 'SPECIFIC';
  specificUser?: string;
}

const AdminSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    title: '',
    message: '',
    recipients: 'ALL',
    specificUser: ''
  });
  const [allowedRoles, setAllowedRoles] = useState<UserRole[]>([]);

  // Load users for user management
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setUsers(data as UserProfile[]);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: "Houve um problema ao carregar a lista de usuários."
        });
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
    
    // Carregar papéis permitidos do localStorage ou valores padrão
    const storedRoles = localStorage.getItem('allowedRoles');
    if (storedRoles) {
      try {
        setAllowedRoles(JSON.parse(storedRoles) as UserRole[]);
      } catch (error) {
        console.error("Erro ao analisar allowedRoles:", error);
        setAllowedRoles([
          UserRole.ADMIN, 
          UserRole.LOGISTICS, 
          UserRole.CLIENT, 
          UserRole.PARTNER, 
          UserRole.FINANCIAL
        ]);
      }
    } else {
      setAllowedRoles([
        UserRole.ADMIN, 
        UserRole.LOGISTICS, 
        UserRole.CLIENT, 
        UserRole.PARTNER, 
        UserRole.FINANCIAL
      ]);
    }
  }, [toast]);

  // Handle role change for a user
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Função atualizada",
        description: "A função do usuário foi atualizada com sucesso."
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar a função do usuário."
      });
    }
  };

  // Handle notification settings change
  const handleNotificationChange = (field: keyof NotificationSettings, value: any) => {
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };

  // Send notification to users
  const handleSendNotification = async () => {
    setIsLoading(true);
    try {
      // Example implementation - in a real app you would send to your notification service
      let recipientIds: string[] = [];

      if (notificationSettings.recipients === 'ALL') {
        recipientIds = users.map(user => user.id);
      } else if (notificationSettings.recipients === 'CLIENTS') {
        recipientIds = users
          .filter(user => user.role === UserRole.CLIENT)
          .map(user => user.id);
      } else if (notificationSettings.recipients === 'PARTNERS') {
        recipientIds = users
          .filter(user => user.role === UserRole.PARTNER)
          .map(user => user.id);
      } else if (notificationSettings.recipients === 'SPECIFIC' && notificationSettings.specificUser) {
        recipientIds = [notificationSettings.specificUser];
      }

      // In a real application, you would insert into a notifications table
      const notificationsToInsert = recipientIds.map(userId => ({
        user_id: userId,
        title: notificationSettings.title,
        message: notificationSettings.message,
        created_at: new Date(),
        read: false
      }));

      console.log("Would send notifications to:", notificationsToInsert);

      // Example: insert into notifications table
      // const { error } = await supabase.from('notifications').insert(notificationsToInsert);
      // if (error) throw error;

      toast({
        title: "Notificações enviadas",
        description: `Notificação "${notificationSettings.title}" enviada para ${recipientIds.length} usuários.`
      });

      // Reset form
      setNotificationSettings({
        title: '',
        message: '',
        recipients: 'ALL',
        specificUser: ''
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast({
        variant: "destructive",
        title: "Erro ao enviar notificações",
        description: "Houve um problema ao enviar as notificações."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle single role selection
  const handleRoleToggle = (role: UserRole) => {
    if (allowedRoles.includes(role)) {
      // Remove role if already selected
      setAllowedRoles(allowedRoles.filter(r => r !== role));
    } else {
      // Add role if not selected
      setAllowedRoles([...allowedRoles, role]);
    }
  };

  const handleSavePermissions = async () => {
    try {
      // Salvar os papéis selecionados no localStorage
      localStorage.setItem('allowedRoles', JSON.stringify(allowedRoles));
      
      toast({
        title: "Permissões salvas",
        description: "As permissões foram salvas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as permissões.",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Configurações de Administrador</h1>
      
      <Tabs defaultValue="profile" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid sm:grid-cols-4 grid-cols-2 gap-2">
          <TabsTrigger value="profile">Dados Pessoais</TabsTrigger>
          <TabsTrigger value="permissions">Permissões</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        {/* Personal Data Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalDataForm />
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Permissões</CardTitle>
              <CardDescription>
                Gerencie os papéis e permissões dos usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="allowedRoles" className="text-base font-semibold">Permissões de Acesso</Label>
                <div className="mt-2 space-y-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.values(UserRole).map(role => (
                    <div key={role} className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id={`role-${role}`}
                        checked={allowedRoles.includes(role)}
                        onChange={() => handleRoleToggle(role)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label htmlFor={`role-${role}`} className="text-sm">
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSavePermissions} className="mt-4">Salvar Permissões</Button>
              </div>

              <Separator className="my-6" />

              <div>
                <h3 className="text-base font-semibold mb-4">Usuários do Sistema</h3>
                {loadingUsers ? (
                  <p>Carregando usuários...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center">
                              Nenhum usuário encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Select
                                  value={user.role}
                                  onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione uma função" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.values(UserRole).map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    toast({
                                      title: "Ação em desenvolvimento",
                                      description: "Esta funcionalidade será implementada em breve."
                                    });
                                  }}
                                >
                                  Detalhes
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Notificações</CardTitle>
              <CardDescription>
                Envie notificações e comunicados para os usuários do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notification-title">Título</Label>
                <Input
                  id="notification-title"
                  value={notificationSettings.title}
                  onChange={(e) => handleNotificationChange('title', e.target.value)}
                  placeholder="Digite o título da notificação"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-message">Mensagem</Label>
                <Input
                  id="notification-message"
                  value={notificationSettings.message}
                  onChange={(e) => handleNotificationChange('message', e.target.value)}
                  placeholder="Digite a mensagem da notificação"
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-recipients">Destinatários</Label>
                <Select
                  value={notificationSettings.recipients}
                  onValueChange={(value: any) => handleNotificationChange('recipients', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione os destinatários" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos os usuários</SelectItem>
                    <SelectItem value="CLIENTS">Somente clientes</SelectItem>
                    <SelectItem value="PARTNERS">Somente parceiros</SelectItem>
                    <SelectItem value="SPECIFIC">Usuário específico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {notificationSettings.recipients === 'SPECIFIC' && (
                <div className="space-y-2">
                  <Label htmlFor="specific-user">Selecione o usuário</Label>
                  <Select
                    value={notificationSettings.specificUser}
                    onValueChange={(value) => handleNotificationChange('specificUser', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <Button 
                onClick={handleSendNotification} 
                disabled={isLoading || !notificationSettings.title || !notificationSettings.message}
                className="w-full mt-4"
              >
                {isLoading ? "Enviando..." : "Enviar Notificação"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
