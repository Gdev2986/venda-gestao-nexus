
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import TablePagination from "@/components/ui/table-pagination";

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  lastLogin?: string;
}

const Settings = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch mock users
  useEffect(() => {
    const fetchUsers = () => {
      setIsLoading(true);
      // Mock data
      const mockUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: UserRole.ADMIN,
          lastLogin: "2023-10-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: UserRole.FINANCIAL,
          lastLogin: "2023-10-14T15:45:00Z",
        },
        {
          id: "3",
          name: "Alan Jackson",
          email: "alan@example.com",
          role: UserRole.LOGISTICS,
          lastLogin: "2023-10-13T09:20:00Z",
        },
        {
          id: "4",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-12T12:10:00Z",
        },
        {
          id: "5",
          name: "Michael Brown",
          email: "michael@example.com",
          role: UserRole.PARTNER,
          lastLogin: "2023-10-11T16:30:00Z",
        },
        {
          id: "6",
          name: "Lisa Taylor",
          email: "lisa@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-10T14:25:00Z",
        },
        {
          id: "7",
          name: "David Miller",
          email: "david@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-09T11:15:00Z",
        },
        {
          id: "8",
          name: "Emma Wilson",
          email: "emma@example.com",
          role: UserRole.PARTNER,
          lastLogin: "2023-10-08T09:45:00Z",
        },
        {
          id: "9",
          name: "Robert Johnson",
          email: "robert@example.com",
          role: UserRole.LOGISTICS,
          lastLogin: "2023-10-07T10:50:00Z",
        },
        {
          id: "10",
          name: "Olivia Davis",
          email: "olivia@example.com",
          role: UserRole.FINANCIAL,
          lastLogin: "2023-10-06T13:40:00Z",
        },
        {
          id: "11",
          name: "William Garcia",
          email: "william@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-05T16:20:00Z",
        },
        {
          id: "12",
          name: "Sophia Martinez",
          email: "sophia@example.com",
          role: UserRole.CLIENT,
          lastLogin: "2023-10-04T15:10:00Z",
        },
      ];

      setUsers(mockUsers);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = (userId: string, newRole: string) => {
    const validRole = newRole as UserRole;
    
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, role: validRole } : user
      )
    );

    toast({
      title: "Função atualizada",
      description: `Função do usuário alterada para ${getRoleName(validRole)}`
    });
  };

  // Get role name in Portuguese
  const getRoleName = (role: UserRole): string => {
    switch(role) {
      case UserRole.ADMIN:
        return "Administrador";
      case UserRole.FINANCIAL:
        return "Financeiro";
      case UserRole.LOGISTICS:
        return "Logística";
      case UserRole.PARTNER:
        return "Parceiro";
      case UserRole.CLIENT:
        return "Cliente";
      default:
        return role;
    }
  };

  // Get role badge
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Badge className="bg-purple-500 hover:bg-purple-600">Administrador</Badge>;
      case UserRole.FINANCIAL:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Financeiro</Badge>;
      case UserRole.LOGISTICS:
        return <Badge className="bg-green-500 hover:bg-green-600">Logística</Badge>;
      case UserRole.PARTNER:
        return <Badge className="bg-amber-500 hover:bg-amber-600">Parceiro</Badge>;
      case UserRole.CLIENT:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Cliente</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Nunca";
    
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "Data inválida";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Configurações do Administrador</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>
            Configure as permissões e funções dos usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função Atual</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Alterar Função</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{formatDate(user.lastLogin)}</TableCell>
                        <TableCell>
                          <Select 
                            value={user.role} 
                            onValueChange={(value) => handleRoleChange(user.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Selecionar função" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                              <SelectItem value={UserRole.FINANCIAL}>Financeiro</SelectItem>
                              <SelectItem value={UserRole.LOGISTICS}>Logística</SelectItem>
                              <SelectItem value={UserRole.PARTNER}>Parceiro</SelectItem>
                              <SelectItem value={UserRole.CLIENT}>Cliente</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4">
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
