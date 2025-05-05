
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import UserPagination from "./UserPagination";
import { RoleChangeDialog } from "./RoleChangeDialog";

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
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const UserTable = ({ 
  users, 
  setUsers, 
  totalPages,
  currentPage,
  onPageChange
}: UserTableProps) => {
  const { toast } = useToast();
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | null>(null);

  const handleRoleChangeClick = (user: User, selectedRole: UserRole) => {
    if (user.role === selectedRole) return; // Sem mudança
    
    setSelectedUser(user);
    setNewRole(selectedRole);
    setRoleDialogOpen(true);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, notes: string) => {
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
            ip_address: 'web-app',
            notes: notes
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
    <div>
      <div className="rounded-md border overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">E-mail</TableHead>
              <TableHead>Função</TableHead>
              <TableHead className="hidden lg:table-cell">Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div>
                      <span>{user.name || "N/A"}</span>
                      <span className="block md:hidden text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChangeClick(user, value as UserRole)}
                      disabled={updatingUser === user.id}
                    >
                      <SelectTrigger className="w-[180px] max-w-full">
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
                  <TableCell className="hidden lg:table-cell">
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="whitespace-nowrap">
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
      
      <div className="mt-4 flex justify-center">
        <UserPagination 
          currentPage={currentPage} 
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {selectedUser && newRole && (
        <RoleChangeDialog
          isOpen={roleDialogOpen}
          onClose={() => setRoleDialogOpen(false)}
          onConfirm={(notes) => handleRoleChange(selectedUser.id, newRole, notes)}
          userName={selectedUser.name || selectedUser.email}
          currentRole={selectedUser.role}
          newRole={newRole}
        />
      )}
    </div>
  );
};

export default UserTable;
