import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  role: UserRole;
}

const UsersTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | UserRole>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    error,
  } = useQuery(
    ["users", searchTerm, roleFilter, page, pageSize],
    async () => {
      let query = supabase
        .from("profiles")
        .select("*")
        .ilike("email", `%${searchTerm}%`)
        .range((page - 1) * pageSize, page * pageSize - 1);

      if (roleFilter !== "all") {
        query = query.eq("role", roleFilter);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return data as User[];
    }
  );

  const { data: totalUsersCount, isLoading: isCountLoading } = useQuery(
    ["usersCount", searchTerm, roleFilter],
    async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .ilike("email", `%${searchTerm}%`);

      if (roleFilter !== "all") {
        query = query.eq("role", roleFilter);
      }

      const { count, error } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return count || 0;
    }
  );

  const totalPages = Math.ceil(totalUsersCount / pageSize);

  useEffect(() => {
    queryClient.prefetchQuery(
      ["users", searchTerm, roleFilter, page + 1, pageSize],
      async () => {
        let query = supabase
          .from("profiles")
          .select("*")
          .ilike("email", `%${searchTerm}%`)
          .range(page * pageSize, (page + 1) * pageSize - 1);

        if (roleFilter !== "all") {
          query = query.eq("role", roleFilter);
        }

        const { data, error } = await query;

        if (error) {
          throw new Error(error.message);
        }

        return data as User[];
      }
    );
  }, [users, searchTerm, roleFilter, page, pageSize, queryClient]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    const roleValue = value === "all" ? "all" : value as UserRole;
    setRoleFilter(roleValue);
    setPage(1);
  };

  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | null>(null);

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedUser(null);
    setNewRole(null);
  };

  const updateRoleMutation = useMutation(
    async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["users", searchTerm, roleFilter, page, pageSize]);
        toast({
          title: "Sucesso",
          description: "Perfil do usuário atualizado com sucesso.",
        });
        handleCloseDialog();
      },
      onError: (error: any) => {
        toast({
          variant: "destructive",
          title: "Erro",
          description: error.message,
        });
      },
    }
  );

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    await updateRoleMutation.mutateAsync({
      userId: selectedUser.id,
      newRole: newRole,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select onValueChange={handleRoleFilterChange} value={roleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
            <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
            <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
            <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
            <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead className="sr-only">Editar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || isCountLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  <Loader2 className="h-4 w-4 mr-2 inline-block animate-spin" />
                  Carregando usuários...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Erro ao carregar usuários.
                </TableCell>
              </TableRow>
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => handleOpenDialog(user)}
                        >
                          Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Editar Perfil</DialogTitle>
                          <DialogDescription>
                            Atualize o perfil do usuário.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              type="email"
                              id="email"
                              value={user.email}
                              className="col-span-3"
                              disabled
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                              Perfil
                            </Label>
                            <Select
                              value={newRole || user.role}
                              onValueChange={(value) =>
                                setNewRole(value as UserRole)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um perfil" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UserRole.ADMIN}>
                                  Administrador
                                </SelectItem>
                                <SelectItem value={UserRole.CLIENT}>
                                  Cliente
                                </SelectItem>
                                <SelectItem value={UserRole.PARTNER}>
                                  Parceiro
                                </SelectItem>
                                <SelectItem value={UserRole.FINANCIAL}>
                                  Financeiro
                                </SelectItem>
                                <SelectItem value={UserRole.LOGISTICS}>
                                  Logística
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseDialog}
                          >
                            Cancelar
                          </Button>
                          <Button type="submit" onClick={handleUpdateRole}>
                            Salvar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <span>
          Total: {totalUsersCount} usuários - Página {page} de {totalPages}
        </span>
        <div>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="mr-2"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersTab;
