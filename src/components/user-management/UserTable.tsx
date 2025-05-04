import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TablePagination } from "@/components/ui/table-pagination";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, User, MoreHorizontal, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRole } from "@/types";
import type { User as UserType } from "@/types";
// Fix the import to use named import instead of default import
import { RoleChangeDialog } from "@/components/user-management/RoleChangeDialog";

interface UserTableProps {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  openRoleDialog: (userId: string) => void;
  roleDialogOpen: boolean;
  closeRoleDialog: () => void;
  selectedUserId: string | null;
  handleRoleChange: (role: UserRole) => Promise<void>;
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
  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Shield className="w-4 h-4" />
            </TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarFallback>{capitalizeFirstLetter(user.name.charAt(0))}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{user.role}</Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(user.created_at), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openRoleDialog(user.id)}>
                        <User className="h-4 w-4 mr-2" />
                        <span>Alterar Role</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <p>Nenhum usuário encontrado</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        page={currentPage}
        total={totalPages}
        onPageChange={onPageChange}
      />

      <RoleChangeDialog
        open={roleDialogOpen}
        onOpenChange={closeRoleDialog}
        userId={selectedUserId}
        handleRoleChange={handleRoleChange}
        changingRole={changingRole}
      />
    </>
  );
};

export default UserTable;
