
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";

export type UserData = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
};

interface UserFilters {
  role?: UserRole;
  search?: string;
}

export function useUserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [changingRole, setChangingRole] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({});
  const { toast } = useToast();

  // Check if current user has admin rights
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setError("Não autorizado");
          return;
        }
        
        // Get user role from profiles table
        const { data, error: roleError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (roleError || !data || data.role !== "ADMIN") {
          setError("Você não tem permissão para acessar esta página");
          return;
        }
        
        // User is admin, fetch users
        fetchUsers();
        
      } catch (err) {
        console.error("Error checking admin access:", err);
        setError("Erro ao verificar permissões");
      } finally {
        setCheckingAccess(false);
      }
    };
    
    checkAdminAccess();
  }, []);

  // Fetch users based on filters and pagination
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      // For demo purposes, we'll use the profiles table which contains roles
      let query = supabase.from("profiles").select("*", { count: "exact" });
      
      // Apply filters
      if (filters.role) {
        query = query.eq("role", filters.role);
      }
      
      if (filters.search) {
        query = query.or(`email.ilike.%${filters.search}%,name.ilike.%${filters.search}%`);
      }
      
      // Apply pagination
      const pageSize = 10;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      query = query.range(from, to);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      // Transform data to match UserData type
      const transformedData = data.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
        avatar: user.avatar,
        phone: user.phone,
        created_at: user.created_at,
        updated_at: user.updated_at,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated"
      }));
      
      setUsers(transformedData);
      
      // Update pagination state
      if (count !== null) {
        setTotalUsers(count);
        setTotalPages(Math.ceil(count / pageSize));
      }
      
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Fetch users when filters or pagination change
  useEffect(() => {
    if (!checkingAccess) {
      fetchUsers();
    }
  }, [fetchUsers, checkingAccess, currentPage, filters]);

  const openRoleDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRoleDialogOpen(true);
  };

  const closeRoleDialog = () => {
    setRoleDialogOpen(false);
    setSelectedUserId("");
  };
  
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setChangingRole(true);
    
    try {
      // Update role in the profiles table
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);
      
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      // Show success message
      toast({
        title: "Função atualizada",
        description: `A função do usuário foi alterada com sucesso.`
      });
      
      // Close the dialog
      closeRoleDialog();
      
    } catch (err) {
      console.error("Error updating user role:", err);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar função",
        description: "Não foi possível atualizar a função do usuário."
      });
    } finally {
      setChangingRole(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const retryFetch = () => {
    fetchUsers();
  };

  return {
    users,
    setUsers,
    loading,
    error,
    roleDialogOpen,
    openRoleDialog,
    closeRoleDialog,
    selectedUserId,
    changingRole,
    checkingAccess,
    retryFetch,
    currentPage,
    totalPages,
    totalUsers,
    handlePageChange,
    handleFilterChange,
    filters,
    updateUserRole,
    handleRoleChange
  };
}

export default useUserManagement;
