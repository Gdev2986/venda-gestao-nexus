import { useState } from "react";
import { useUserManagement } from "./useUserManagement";
import { UserRole } from "@/types";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export function UserTable() {
  const {
    users,
    isLoading,
    error,
    setCurrentPage,
    currentPage,
    totalPages,
    deleteUser,
    updateUserRole,
    logAction,
  } = useUserManagement();

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
    role: UserRole;
    email: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = (user: { id: string; name: string; role: UserRole; email: string }) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                {/* <MoreHorizontal className="h-4 w-4" /> */}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDialog(user)}>
                Change Role
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteUser(user.id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    // First, find the user
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const prevRole = user.role;
    // Update the user role
    await updateUserRole(userId, newRole);

    // Log the action
    const logEntry = {
      user_id: userId,
      acted_by: "current-admin-id", // In a real app, this would be the actual admin's ID
      action: "ROLE_CHANGE",
      before_role: prevRole as any,
      after_role: newRole as any,
      ip_address: "127.0.0.1", // Placeholder IP
      notes: `Role changed from ${prevRole} to ${newRole}`
    };

    await logAction([logEntry]);
    
    // Close the dialog
    setIsDialogOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter users..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {users.length} row(s)
            selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Role Change Dialog */}
      {selectedUser && (
        <RoleChangeDialog
          isOpen={isDialogOpen}
          onClose={closeDialog}
          user={selectedUser}
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  );
}

interface RoleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    role: UserRole;
    email: string;
  };
  onRoleChange: (userId: string, newRole: UserRole) => Promise<void>;
}

const RoleChangeDialog: React.FC<RoleChangeDialogProps> = ({
  isOpen,
  onClose,
  user,
  onRoleChange,
}) => {
  const [newRole, setNewRole] = useState(user.role);

  const handleRoleSelection = (role: UserRole) => {
    setNewRole(role);
  };

  const handleConfirm = async () => {
    await onRoleChange(user.id, newRole);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "hidden"
        } flex items-center justify-center bg-black bg-opacity-50`}
    >
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Change Role</h2>
        <p className="mb-4">Select a new role for {user.name}:</p>
        <div className="flex space-x-4 mb-4">
          <Button
            variant={newRole === UserRole.ADMIN ? "default" : "outline"}
            onClick={() => handleRoleSelection(UserRole.ADMIN)}
          >
            Admin
          </Button>
          <Button
            variant={newRole === UserRole.CLIENT ? "default" : "outline"}
            onClick={() => handleRoleSelection(UserRole.CLIENT)}
          >
            Client
          </Button>
          <Button
            variant={newRole === UserRole.PARTNER ? "default" : "outline"}
            onClick={() => handleRoleSelection(UserRole.PARTNER)}
          >
            Partner
          </Button>
          <Button
            variant={newRole === UserRole.FINANCIAL ? "default" : "outline"}
            onClick={() => handleRoleSelection(UserRole.FINANCIAL)}
          >
            Financial
          </Button>
          <Button
            variant={newRole === UserRole.LOGISTICS ? "default" : "outline"}
            onClick={() => handleRoleSelection(UserRole.LOGISTICS)}
          >
            Logistics
          </Button>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};
