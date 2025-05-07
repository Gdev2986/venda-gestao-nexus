import { useState, useEffect } from 'react';
import { UserData, UserRole } from '@/types';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Mock data
  useEffect(() => {
    const mockUsers: UserData[] = [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
        created_at: '2023-01-15T10:30:00Z',
        status: 'active'
      },
      {
        id: '2',
        name: 'Client User',
        email: 'client@example.com',
        role: UserRole.CLIENT,
        created_at: '2023-02-20T14:45:00Z',
        status: 'inactive'
      },
      {
        id: '3',
        name: 'Financial User',
        email: 'financial@example.com',
        role: UserRole.FINANCIAL,
        created_at: '2023-03-10T09:00:00Z',
        status: 'pending'
      },
      {
        id: '4',
        name: 'Logistics User',
        email: 'logistics@example.com',
        role: UserRole.LOGISTICS,
        created_at: '2023-04-05T16:20:00Z',
        status: 'active'
      },
      {
        id: '5',
        name: 'Partner User',
        email: 'partner@example.com',
        role: UserRole.PARTNER,
        created_at: '2023-05-01T11:15:00Z',
        status: 'active'
      }
    ];

    setLoading(true);
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return {
    users: paginatedUsers,
    loading,
    error,
    currentPage,
    totalPages,
    onPageChange: handlePageChange
  };
};
