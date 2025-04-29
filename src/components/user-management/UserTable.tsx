
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface UserTableProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserTable = ({ users, setUsers }: UserTableProps) => {
  const { toast } = useToast();
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

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

  return (
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
  );
};

export default UserTable;
