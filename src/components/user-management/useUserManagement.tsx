
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

const USERS_PER_PAGE = 10;

export interface UserFilters {
  search: string;
  role: UserRole | null;
}

export const useUserManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({
    search: "",
    role: null
  });

  useEffect(() => {
    // Verificar se o usuário tem permissão de administrador
    if (userRole === UserRole.ADMIN) {
      setCheckingAccess(false);
      fetchUsers();
    } else if (userRole !== undefined) {
      setCheckingAccess(false);
      // Se não for admin, redirecionar para o dashboard
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página"
      });
      navigate(PATHS.DASHBOARD);
    }
  }, [userRole, navigate]);

  useEffect(() => {
    if (!checkingAccess && userRole === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [currentPage, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentando buscar usuários como admin...");
      console.log("Página atual:", currentPage);
      console.log("Filtros:", filters);
      
      // Primeiro contamos o total para calcular a paginação
      let countQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Aplicar filtros para a contagem
      if (filters.search) {
        countQuery = countQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      
      if (filters.role) {
        // Usando a string da enumeração para comparação
        countQuery = countQuery.eq('role', filters.role);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error("Error counting users:", countError);
        setError(`Falha ao contar usuários: ${countError.message}`);
        return;
      }
      
      const totalCount = count || 0;
      setTotalUsers(totalCount);
      setTotalPages(Math.ceil(totalCount / USERS_PER_PAGE));
      
      // Agora buscamos os dados paginados
      let query = supabase
        .from('profiles')
        .select('*');
      
      // Aplicar filtros
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }
      
      if (filters.role) {
        // Usando a string da enumeração para comparação
        query = query.eq('role', filters.role);
      }
      
      // Aplicar paginação
      const from = (currentPage - 1) * USERS_PER_PAGE;
      const to = from + USERS_PER_PAGE - 1;
      
      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) {
        console.error("Error fetching users:", error);
        setError(`Falha ao carregar usuários: ${error.message}`);
        toast({
          variant: "destructive",
          title: "Erro ao carregar usuários",
          description: error.message
        });
        return;
      }
      
      console.log("Usuários carregados com sucesso:", data?.length || 0);
      setUsers(data || []);
    } catch (error: any) {
      console.error("Exception while fetching users:", error);
      setError(`Falha ao carregar usuários: ${error?.message || 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Voltar para a primeira página ao filtrar
  };

  const retryFetch = () => {
    fetchUsers();
  };

  return {
    users,
    setUsers,
    loading,
    error,
    checkingAccess,
    retryFetch,
    currentPage,
    totalPages,
    totalUsers,
    handlePageChange,
    handleFilterChange,
    filters
  };
};
