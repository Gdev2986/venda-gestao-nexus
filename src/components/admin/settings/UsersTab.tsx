
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/formatters";
import { UserRole } from "@/types";

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

interface UsersTabProps {
  openRoleModal: (user: ProfileData) => void;
}

export function UsersTab({ openRoleModal }: UsersTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading users:", error);
          return;
        }

        setUsers(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800 border-red-200";
      case UserRole.FINANCIAL:
        return "bg-purple-100 text-purple-800 border-purple-200";
      case UserRole.LOGISTICS:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case UserRole.PARTNER:
        return "bg-amber-100 text-amber-800 border-amber-200";
      case UserRole.CLIENT:
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : users;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-2">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="w-full overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Nome</TableHead>
                  <TableHead className="min-w-[200px]">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Função</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Criação</TableHead>
                  <TableHead className="text-right w-[80px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Carregando usuários...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className={getRoleBadgeColor(user.role)}
                        >
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(new Date(user.created_at))}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                openRoleModal(user);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Alterar Função
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
