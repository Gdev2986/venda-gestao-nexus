
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Update ProfileData interface to accept string for role
interface ProfileData {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [maintenance, setMaintenance] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<ProfileData | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      if (selectedRole !== 'all') {
        query = query.eq('role', selectedRole);
      }
      
      // Apply pagination
      const startRange = (currentPage - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .range(startRange, endRange);
      
      if (error) throw error;
      
      // Calculate total pages
      const total = count ? Math.ceil(count / itemsPerPage) : 0;
      setTotalPages(total);
      
      // Cast the data to ProfileData type
      setUsers(data as ProfileData[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', selectedUser.id);
        
      if (error) throw error;
      
      toast({
        title: "Função atualizada",
        description: `A função de ${selectedUser.name} foi atualizada para ${newRole}.`
      });
      
      setShowRoleModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário."
      });
    }
  };

  const openRoleModal = (user: ProfileData) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };
  
  const toggleMaintenance = () => {
    setMaintenance(!maintenance);
    toast({
      title: !maintenance ? "Modo manutenção ativado" : "Modo manutenção desativado",
      description: !maintenance 
        ? "O sistema está em modo de manutenção. Apenas administradores podem acessar." 
        : "O sistema está disponível para todos os usuários."
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="usuarios" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="roleFilter">Filtrar por função:</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(value) => {
                    setSelectedRole(value);
                    setCurrentPage(1); // Reset to first page when role changes
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as funções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as funções</SelectItem>
                    <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                    <SelectItem value={UserRole.USER}>Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {loading ? (
                <p>Carregando usuários...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.map((user) => (
                    <Card key={user.id} className="shadow-sm">
                      <CardContent className="flex flex-col gap-2">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                        <div className="text-xs text-muted-foreground">Função: {user.role}</div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openRoleModal(user)}
                        >
                          Alterar Função
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* System Tab */}
        <TabsContent value="sistema" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Sistema</CardTitle>
              <CardContent className="pl-0 pb-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode">Modo de Manutenção</Label>
                    <Switch
                      id="maintenanceMode"
                      checked={maintenance}
                      onCheckedChange={toggleMaintenance}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notificações</Label>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    />
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Alterar Função de {selectedUser.name}
            </h2>
            <div className="mb-4">
              <Label htmlFor="newRole">Nova Função:</Label>
              <Select
                value={newRole}
                onValueChange={(value) => setNewRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.USER}>Usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowRoleModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleRoleChange}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
