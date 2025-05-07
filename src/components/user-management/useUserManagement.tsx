import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole, UserData } from "@/types";

interface LogEntry {
  user_id: string;
  acted_by: string;
  action: string;
  before_role: UserRole;
  after_role: UserRole;
  ip_address: string;
  notes: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error, count } = await supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
        return;
      }

      if (count) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      }

      // Transform the data to match the UserData interface
      const transformedUsers: UserData[] = data
        ? data.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            status: "active", // Replace with actual status if available
          }))
        : [];

      setUsers(transformedUsers);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
      setError("An unexpected error occurred while fetching users.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId);

      if (error) {
        console.error("Error deleting user:", error);
        setError(error.message);
      } else {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      }
    } catch (err) {
      console.error("Unexpected error deleting user:", err);
      setError("An unexpected error occurred while deleting the user.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) {
        console.error("Error updating user role:", error);
        setError(error.message);
      } else {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (err) {
      console.error("Unexpected error updating user role:", err);
      setError("An unexpected error occurred while updating the user role.");
    } finally {
      setIsLoading(false);
    }
  };

  const logAction = async (logEntries: LogEntry[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("access_logs").insert(logEntries);

      if (error) {
        console.error("Error logging action:", error);
        setError(error.message);
      }
    } catch (err) {
      console.error("Unexpected error logging action:", err);
      setError("An unexpected error occurred while logging the action.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    deleteUser,
    updateUserRole,
    logAction,
  };
};
