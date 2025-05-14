import { useState, useEffect } from "react";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface UsersTabProps {
  openRoleModal: (user: ProfileData) => void;
}

export const UsersTab = ({ openRoleModal }: UsersTabProps) => {
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<ProfileData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("profiles")
          .select("id, name, email, role, created_at")
          .order("created_at", { ascending: false });

        if (selectedRole !== "all") {
          // Convert string to enum to match the database format
          query = query.eq("role", selectedRole);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          setUsers(data as ProfileData[]);
          setFilteredUsers(data as ProfileData[]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [selectedRole, toast]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-red-100 text-red-800";
      case UserRole.CLIENT:
        return "bg-blue-100 text-blue-800";
      case UserRole.PARTNER:
        return "bg-green-100 text-green-800";
      case UserRole.FINANCIAL:
        return "bg-purple-100 text-purple-800";
      case UserRole.LOGISTICS:
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: ptBR,
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <CardContent>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-[200px]">
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administradores</SelectItem>
              <SelectItem value={UserRole.CLIENT}>Clientes</SelectItem>
              <SelectItem value={UserRole.PARTNER}>Parceiros</SelectItem>
              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
              <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nenhum usuário encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openRoleModal(user)}
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
      )}
    </CardContent>
  );
};
