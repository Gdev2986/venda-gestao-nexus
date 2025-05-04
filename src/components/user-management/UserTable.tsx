
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import RoleChangeDialog from "./RoleChangeDialog";
import { UserRole } from "@/types";
import UserPagination from "./UserPagination";
import { UserData } from "./useUserManagement";

interface UserTableProps {
  users: UserData[];
  setUsers: React.Dispatch<React.SetStateAction<UserData[]>>;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  openRoleDialog: (userId: string) => void;
  roleDialogOpen: boolean;
  closeRoleDialog: () => void;
  selectedUserId: string;
  handleRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
  changingRole: boolean;
}

const UserTable = ({ 
  users, 
  setUsers,
  totalPages,
  currentPage,
  onPageChange,
  openRoleDialog,
  roleDialogOpen,
  closeRoleDialog,
  selectedUserId,
  handleRoleChange,
  changingRole
}: UserTableProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-500 hover:bg-red-600";
      case UserRole.PARTNER:
        return "bg-blue-500 hover:bg-blue-600";
      case UserRole.FINANCIAL:
        return "bg-green-500 hover:bg-green-600";
      case UserRole.LOGISTICS:
        return "bg-purple-500 hover:bg-purple-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getRoleName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Administrador";
      case UserRole.PARTNER:
        return "Parceiro";
      case UserRole.CLIENT:
        return "Cliente";
      case UserRole.FINANCIAL:
        return "Financeiro";
      case UserRole.LOGISTICS:
        return "Logística";
      default:
        return role;
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  const selectedUser = users.find(user => user.id === selectedUserId);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Usuário</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="hidden md:table-cell">Função</TableHead>
              <TableHead className="hidden lg:table-cell">Cadastrado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {getRoleName(user.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {getTimeAgo(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openRoleDialog(user.id)}
                    >
                      Alterar função
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <UserPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {selectedUser && (
        <RoleChangeDialog 
          open={roleDialogOpen} 
          onClose={closeRoleDialog}
          user={selectedUser}
          onChangeRole={handleRoleChange}
          isLoading={changingRole}
        />
      )}
    </>
  );
};

export default UserTable;
