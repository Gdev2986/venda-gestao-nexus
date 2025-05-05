
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserData } from '@/types';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface UserFiltersState {
  role?: UserRole;
  searchTerm?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState<UserFiltersState>({});
  
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { updateUserRole } = useAuth() as any;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          setError(error.message);
          return;
        }

        // Transform the data to match our UserData interface
        const userData = data.map(user => ({
          ...user,
          app_metadata: {},
          user_metadata: {},
          aud: ''
        })) as UserData[];
        
        setUsers(userData);
        
        // For pagination mock (would be replaced with actual pagination)
        setTotalUsers(data.length);
        setTotalPages(Math.ceil(data.length / 10));
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Implement pagination logic here once backend supports it
  };

  const handleFilterChange = (newFilters: UserFiltersState) => {
    setFilters(newFilters);
    // Implement filtering logic here
  };

  const retryFetch = () => {
    // Re-fetch users data
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
    filters
  };
};
