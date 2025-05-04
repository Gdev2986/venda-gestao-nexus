import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface UserData extends User {
  role: UserRole;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [changingRole, setChangingRole] = useState(false);
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

        setUsers(data as UserData[]);
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

  return {
    users,
    loading,
    error,
    roleDialogOpen,
    openRoleDialog,
    closeRoleDialog,
    selectedUserId,
    handleRoleChange,
    changingRole,
  };
};
