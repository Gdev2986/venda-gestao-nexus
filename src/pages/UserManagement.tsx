
import { useState, useEffect } from "react";
import { UserData, UserRole } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import UserTable from "@/components/user-management/UserTable";

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
        status: 'active'
      },
      {
        id: '4',
        name: 'Partner User',
        email: 'partner@example.com',
        role: UserRole.PARTNER,
        created_at: '2023-04-05T16:20:00Z',
        status: 'pending'
      },
      {
        id: '5',
        name: 'Logistics User',
        email: 'logistics@example.com',
        role: UserRole.LOGISTICS,
        created_at: '2023-05-01T11:15:00Z',
        status: 'active'
      }
    ];

    setUsers(mockUsers);
    setTotalPages(1);
  }, []);

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(user => user.id !== userToDelete));
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      toast({
        title: "Usuário excluído",
        description: "O usuário foi removido com sucesso."
      });
    }
  };

  const handleEditClick = (user: UserData) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = (updatedUser: UserData) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setIsEditDialogOpen(false);
    setUserToEdit(null);
    toast({
      title: "Usuário atualizado",
      description: "As informações do usuário foram atualizadas."
    });
  };

  const handleCreateClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateUser = (newUser: UserData) => {
    setUsers([...users, newUser]);
    setIsCreateDialogOpen(false);
    toast({
      title: "Usuário criado",
      description: "Um novo usuário foi adicionado com sucesso."
    });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">
            Visualize, edite e gerencie os usuários do sistema
          </p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Usuário
        </Button>
      </div>

      <UserTable 
        users={users}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Excluir Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza de que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={() => setIsEditDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>
              Atualize as informações do usuário.
            </DialogDescription>
          </DialogHeader>
          <EditUserForm 
            user={userToEdit} 
            onUpdate={handleUpdateUser} 
            onCancel={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={() => setIsCreateDialogOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Usuário</DialogTitle>
            <DialogDescription>
              Adicione um novo usuário ao sistema.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm onCreate={handleCreateUser} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface EditUserFormProps {
  user: UserData | null;
  onUpdate: (user: UserData) => void;
  onCancel: () => void;
}

const EditUserForm = ({ user, onUpdate, onCancel }: EditUserFormProps) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState<UserRole>(user?.role || UserRole.CLIENT);
  const [status, setStatus] = useState<"active" | "inactive" | "pending">(user?.status as "active" | "inactive" | "pending" || "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updatedUser: UserData = {
      ...user,
      name,
      email,
      role,
      status
    };
    onUpdate(updatedUser);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select 
          value={role} 
          onValueChange={(value: any) => setRole(value as UserRole)}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Selecione um role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
            <SelectItem value={UserRole.FINANCIAL}>Financial</SelectItem>
            <SelectItem value={UserRole.PARTNER}>Partner</SelectItem>
            <SelectItem value={UserRole.LOGISTICS}>Logistics</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={status} 
          onValueChange={(value: any) => setStatus(value as "active" | "inactive" | "pending")}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Atualizar</Button>
      </DialogFooter>
    </form>
  );
};

interface CreateUserFormProps {
  onCreate: (user: UserData) => void;
  onCancel: () => void;
}

const CreateUserForm = ({ onCreate, onCancel }: CreateUserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [status, setStatus] = useState<"active" | "inactive" | "pending">("active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: UserData = {
      id: Math.random().toString(36).substring(7),
      name,
      email,
      role,
      created_at: new Date().toISOString(),
      status: status
    };
    onCreate(newUser);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value: any) => setRole(value as UserRole)}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Selecione um role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.CLIENT}>Client</SelectItem>
            <SelectItem value={UserRole.FINANCIAL}>Financial</SelectItem>
            <SelectItem value={UserRole.PARTNER}>Partner</SelectItem>
            <SelectItem value={UserRole.LOGISTICS}>Logistics</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: any) => setStatus(value as "active" | "inactive" | "pending")}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Selecione um status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Criar</Button>
      </DialogFooter>
    </form>
  );
};

export default UserManagement;
