
// Just update the type conversion parts
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserPagination from "@/components/user-management/UserPagination";
import { UserFilters as UserFiltersType } from "@/components/user-management/UserFilters";
import LoadingState from "@/components/user-management/LoadingState";
import ErrorState from "@/components/user-management/ErrorState";
import RoleChangeDialog from "@/components/user-management/RoleChangeDialog";
import { UserRole } from "@/types";
import { toDBRole } from "@/types/user-role";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (searchTerm) {
        query = query.ilike("email", `%${searchTerm}%`);
      }

      if (roleFilter !== "ALL") {
        query = query.eq("role", roleFilter);
      }

      const { data, error, count } = await query
        .range((currentPage - 1) * 10, currentPage * 10 - 1);

      if (error) {
        throw error;
      }

      if (data) {
        // Type assertion to ensure the data matches the User interface
        const typedData = data as User[];
        setUsers(typedData);
        setTotalPages(Math.ceil(count ? count / 10 : 0));
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  // Update only the role handling parts with proper typing
  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // Use the safe conversion utility
    const dbRole = toDBRole(newRole);
    
    if (!dbRole) {
      console.error("Invalid role:", newRole);
      return;
    }
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: dbRole })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Optimistically update the user's role in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast({
        title: "Role updated",
        description: `User role updated to ${newRole}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleOpenRoleChangeDialog = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleCloseRoleChangeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  // Ensure selectedRole is properly typed as UserRole
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CLIENT);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-2">
            <Input
              type="search"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Create a simple filter since UserFilters is just a type */}
            <Select 
              value={roleFilter} 
              onValueChange={(value) => setRoleFilter(value as UserRole | "ALL")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
                <SelectItem value={UserRole.FINANCIAL}>Financial</SelectItem>
                <SelectItem value={UserRole.PARTNER}>Partner</SelectItem>
                <SelectItem value={UserRole.LOGISTICS}>Logistics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState errorMessage={error} onRetry={fetchUsers} />
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRoleChangeDialog(user)}
                        >
                          Alterar Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <UserPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}

          <RoleChangeDialog
            isOpen={isDialogOpen}
            onClose={handleCloseRoleChangeDialog}
            user={selectedUser}
            onRoleChange={handleRoleChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
