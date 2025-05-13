
import React, { useState } from "react";
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
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<UserRole | null>(null);

  // Safe conversion from string to UserRole
  const convertToUserRole = (role: string): UserRole => {
    switch (role.toUpperCase()) {
      case "ADMIN": return UserRole.ADMIN;
      case "CLIENT": return UserRole.CLIENT;
      case "PARTNER": return UserRole.PARTNER;
      case "FINANCIAL": return UserRole.FINANCIAL; 
      case "LOGISTICS": return UserRole.LOGISTICS;
      default: return UserRole.CLIENT;
    }
  };

  // Fetch users with proper query setup
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", searchTerm, roleFilter, page, pageSize],
    queryFn: async () => {
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

      // Convert string role to UserRole enum
      return (data || []).map(user => ({
        ...user,
        role: convertToUserRole(user.role)
      })) as User[];
    },
  });

  // Count total users for pagination
  const { data: totalUsersCount, isLoading: isCountLoading } = useQuery({
    queryKey: ["usersCount", searchTerm, roleFilter],
    queryFn: async () => {
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
    },
  });

  // Calculate total pages
  const totalPages = Math.ceil((totalUsersCount || 0) / pageSize);

  // Prefetch next page
  React.useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["users", searchTerm, roleFilter, page + 1, pageSize],
      queryFn: async () => {
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

        return (data || []).map(user => ({
          ...user,
          role: convertToUserRole(user.role)
        })) as User[];
      },
    });
  }, [users, searchTerm, roleFilter, page, pageSize, queryClient]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPage(1);
  };

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

  // Update user role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: UserRole }) => {
      const { data, error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
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
        description: error.message || "Erro ao atualizar perfil",
      });
    },
  });

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;
    updateRoleMutation.mutate({
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
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger className="w-[180px]">
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
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => handleOpenDialog(user)}
                  >
                    Editar
                  </Button>
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
      
      <div className="flex items-center justify-between py-4">
        <span>
          Total: {totalUsersCount || 0} usuários - Página {page} de {totalPages || 1}
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
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages || 1))}
            disabled={page === totalPages || !totalPages}
          >
            Próximo
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize o perfil do usuário.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={selectedUser.email}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Perfil
                </Label>
                <div className="col-span-3">
                  <Select
                    value={String(newRole)}
                    onValueChange={(value) => setNewRole(convertToUserRole(value))}
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
            </div>
          )}
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
    </div>
  );
};

export default UsersTab;
