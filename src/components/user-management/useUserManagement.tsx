
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserData } from '@/types';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useDebounce } from '@/hooks/use-debounce';

interface UserFilters {
  search?: string;
  role?: UserRole | '';
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<UserFilters>({});
  const debouncedFilters = useDebounce(filters, 300);

  const PAGE_SIZE = 10;
  
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { updateUserRole } = useAuth() as any;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if current user has admin access
      if (!currentUser) {
        setError("Not authenticated");
        setCheckingAccess(false);
        return;
      }
      
      setCheckingAccess(false);
      
      // Calculate pagination
      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' });
        
      // Apply filters
      if (debouncedFilters.search) {
        query = query.or(`name.ilike.%${debouncedFilters.search}%,email.ilike.%${debouncedFilters.search}%`);
      }
      
      if (debouncedFilters.role) {
        query = query.eq('role', debouncedFilters.role);
      }
      
      // Add pagination
      query = query.range(from, to);
      
      const { data, error, count } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      if (count !== null) {
        setTotalUsers(count);
        setTotalPages(Math.ceil(count / PAGE_SIZE));
      }

      setUsers(data as UserData[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, currentPage, debouncedFilters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: UserFilters) => {
    setFilters(prev => ({...prev, ...newFilters}));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const retryFetch = () => {
    fetchUsers();
  };

  const openRoleDialog = (userId: string) => {
    setSelectedUserId(userId);
    setRoleDialogOpen(true);
  };

  const closeRoleDialog = () => {
    setSelectedUserId(null);
    setRoleDialogOpen(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setChangingRole(true);
    try {
      // Update user role in database
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);
        
      if (error) throw error;
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      
      // Show success message
      toast({
        title: 'Role updated',
        description: `User role has been updated to ${newRole}`,
      });
      
      // If changing our own role, redirect appropriately
      if (userId === currentUser?.id) {
        // Update local role state
        updateUserRole(newRole);
        
        // Redirect to appropriate dashboard based on new role
        switch (newRole) {
          case UserRole.ADMIN:
            navigate(PATHS.ADMIN.DASHBOARD);
            break;
          case UserRole.CLIENT:
            navigate(PATHS.USER.DASHBOARD);
            break;
          case UserRole.PARTNER:
            navigate(PATHS.PARTNER.DASHBOARD);
            break;
          case UserRole.FINANCIAL:
            navigate(PATHS.FINANCIAL.DASHBOARD);
            break;
          case UserRole.LOGISTICS:
            navigate(PATHS.LOGISTICS.DASHBOARD);
            break;
          default:
            navigate(PATHS.USER.DASHBOARD);
        }
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    } finally {
      setChangingRole(false);
      setRoleDialogOpen(false);
    }
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
    handleRoleChange,
    changingRole,
    checkingAccess,
    retryFetch,
    currentPage,
    totalPages,
    totalUsers,
    handlePageChange,
    handleFilterChange,
    filters,
  };
};
