
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

// Enhanced UserData interface that extends User with the role property
interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  created_at: string;
  updated_at: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  phone?: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filters, setFilters] = useState({});
  const [checkingAccess, setCheckingAccess] = useState(false);
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { updateUserRole } = useAuth() as any;

  const retryFetch = () => {
    fetchUsers();
  };

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

      // Explicitly cast the data to UserData[]
      setUsers(data as unknown as UserData[]);
      setTotalUsers(data?.length || 0);
      setTotalPages(Math.ceil((data?.length || 0) / 10)); // Assuming 10 users per page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // Implementation would filter users based on the filter criteria
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
    currentPage,
    totalPages,
    totalUsers,
    handlePageChange,
    handleFilterChange,
    filters,
    checkingAccess,
    retryFetch
  };
};
