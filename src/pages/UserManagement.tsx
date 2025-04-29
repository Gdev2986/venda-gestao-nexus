
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useUserRole } from "@/hooks/use-user-role";
import { PATHS } from "@/routes/paths";

const UserManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

  useEffect(() => {
    // Verificar se o usuário tem permissão de administrador
    if (userRole === UserRole.ADMIN) {
      setCheckingAccess(false);
      fetchUsers();
    } else if (userRole !== undefined) {
      setCheckingAccess(false);
      // Se não for admin, redirecionar para o dashboard
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página"
      });
      navigate(PATHS.DASHBOARD);
    }
  }, [userRole, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentando buscar usuários como admin...");
      
      // Fetch profiles from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching users:", error);
        setError(`Falha ao carregar usuários: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: error.message
        });
        return;
      }
      
      console.log("Usuários carregados com sucesso:", data?.length || 0);
      setUsers(data || []);
    } catch (error: any) {
      console.error("Exception while fetching users:", error);
      setError(`Falha ao carregar usuários: ${error?.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      setUpdatingUser(userId);
      
      // Armazenar o usuário atual para exibir no log de auditoria
      const currentUser = await supabase.auth.getUser();
      const currentUserId = currentUser.data?.user?.id;
      
      // Obter o papel anterior para registrar no log
      const { data: userBefore } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      const beforeRole = userBefore?.role;
      
      // Atualizar o papel do usuário
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar perfil",
          description: error.message
        });
        return;
      }

      // Registrar a alteração no log de acesso (se a tabela existir)
      try {
        await supabase
          .from('access_logs')
          .insert([{
            user_id: userId,
            acted_by: currentUserId,
            action: 'ROLE_CHANGE',
            before_role: beforeRole,
            after_role: newRole,
            ip_address: 'web-app'
          }]);
      } catch (logError) {
        console.warn("Não foi possível registrar o log de acesso:", logError);
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Perfil atualizado",
        description: "A função do usuário foi alterada com sucesso."
      });
    } catch (error: any) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: "Não foi possível atualizar a função do usuário."
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  const retryFetch = () => {
    fetchUsers();
  };

  if (checkingAccess) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Spinner size="lg" />
            <p className="mt-4">Verificando permissões...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os usuários do sistema
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
            <CardDescription>
              Altere as funções dos usuários ou visualize seus detalhes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
                <Button onClick={retryFetch} variant="outline" className="mt-2">Tentar novamente</Button>
              </Alert>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.name || "N/A"}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                              disabled={updatingUser === user.id}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Selecionar função" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                                <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                                <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                                <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Nenhum usuário encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
