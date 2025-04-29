
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { useUserRole } from "@/hooks/use-user-role";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

export const useUserManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);

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

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Tentando buscar usuários como admin...");
      
      // Fetch profiles from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
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

  const retryFetch = () => {
    fetchUsers();
  };

  return {
    users,
    setUsers,
    loading,
    error,
    checkingAccess,
    retryFetch
  };
};
