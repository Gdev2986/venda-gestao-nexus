
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  phone?: string;
}

interface UserTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const UserTable = ({ users, currentPage, totalPages, onPageChange }: UserTableProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const getRoleBadge = (role: UserRole) => {
    const roleColors = {
      [UserRole.ADMIN]: "bg-red-100 text-red-800 border-red-200",
      [UserRole.CLIENT]: "bg-blue-100 text-blue-800 border-blue-200",
      [UserRole.PARTNER]: "bg-green-100 text-green-800 border-green-200",
      [UserRole.FINANCIAL]: "bg-purple-100 text-purple-800 border-purple-200", 
      [UserRole.LOGISTICS]: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };

    return (
      <Badge variant="outline" className={`${roleColors[role]} font-medium`}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Nome</TableHead>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead className="w-[100px]">Função</TableHead>
              <TableHead className="hidden sm:table-cell">Data de criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Nenhum usuário encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Próxima</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserTable;
