import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export const UsersTab = ({ openRoleModal }: UsersTabProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [users, setUsers] = useState<ProfileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);

  const { toast } = useToast();
  const itemsPerPage = 10;

  // Fetch available roles from the profiles table
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .not('role', 'is', null);

        if (error) throw error;

        // Extract unique roles
        const uniqueRoles = Array.from(new Set(data.map(item => item.role)));
        setAvailableRoles(uniqueRoles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  // Fetch users from Supabase
  useEffect(() => {
    fetchUsers();
  }, [currentPage, selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
      
      if (selectedRole !== 'all') {
        // Use the string value directly
        query = query.eq('role', selectedRole);
      }
      
      // Apply pagination
      const startRange = (currentPage - 1) * itemsPerPage;
      const endRange = startRange + itemsPerPage - 1;
      
      const { data, error, count } = await query
        .range(startRange, endRange);
      
      if (error) throw error;
      
      // Calculate total pages
      const total = count ? Math.ceil(count / itemsPerPage) : 0;
      setTotalPages(total);
      
      setUsers(data as ProfileData[]);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de usuários."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerenciar Usuários</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={selectedRole}
            onValueChange={(value: string) => {
              setSelectedRole(value);
              setCurrentPage(1); // Reset to first page when role changes
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Data de criação</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openRoleModal(user)}
                      >
                        Alterar Função
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próximo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersTab;
