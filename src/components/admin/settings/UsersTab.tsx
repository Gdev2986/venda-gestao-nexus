
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

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
  
  const { toast } = useToast();
  const itemsPerPage = 10;

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
      
      // Cast the data to ProfileData type
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
          <Label htmlFor="roleFilter">Filtrar por função:</Label>
          <Select
            value={selectedRole}
            onValueChange={(value) => {
              setSelectedRole(value);
              setCurrentPage(1); // Reset to first page when role changes
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as funções" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as funções</SelectItem>
              <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
              <SelectItem value={UserRole.USER}>Usuário</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {loading ? (
          <p>Carregando usuários...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.map((user) => (
              <Card key={user.id} className="shadow-sm">
                <CardContent className="flex flex-col gap-2">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="text-xs text-muted-foreground">Função: {user.role}</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openRoleModal(user)}
                  >
                    Alterar Função
                  </Button>
                </CardContent>
              </Card>
            ))}
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
