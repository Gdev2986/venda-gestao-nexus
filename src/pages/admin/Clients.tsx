
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PATHS } from "@/routes/paths";
import { Search } from "lucide-react";
import { Client } from "@/types";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { useClients } from "@/hooks/use-clients";
import ClientForm, { ClientFormValues } from "@/components/clients/ClientForm";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Import the ClientsTable and ClientDetailsView components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EyeIcon, PenIcon, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// ClientsTable component
const ClientsTable = ({ 
  clients, 
  isLoading, 
  onView, 
  onEdit, 
  onDelete 
}: { 
  clients: Client[];
  isLoading: boolean;
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex space-x-4">
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden lg:table-cell">Localização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.business_name || "Nome não informado"}</TableCell>
                <TableCell>{client.contact_name}</TableCell>
                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                <TableCell className="hidden lg:table-cell">{`${client.city || ''}, ${client.state || ''}`}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onView(client)} title="Visualizar">
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Editar">
                      <PenIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => onDelete(client)}
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

// ClientDetailsView component
const ClientDetailsView = ({
  client,
  onClose,
  onEdit,
  onDelete
}: {
  client: Client;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="sm:max-w-md p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Detalhes do Cliente</h2>
          <p className="text-sm text-muted-foreground">
            Informações completas sobre {client.business_name}
          </p>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome da Empresa</h3>
              <p>{client.business_name}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Documento</h3>
              <p>{client.document || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Contato</h3>
              <p>{client.contact_name || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Email</h3>
              <p>{client.email || "Não informado"}</p>
            </div>

            <div>
              <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
              <p>{client.phone || "Não informado"}</p>
            </div>

            {(client.address || client.city || client.state) && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-1">Endereço</h3>
                <p>
                  {[
                    client.address,
                    client.city && client.state && `${client.city}, ${client.state}`,
                    client.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-row justify-between sm:justify-between gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Fechar
          </Button>
          <div className="flex flex-row gap-2">
            <Button 
              onClick={onEdit}
              className="gap-2"
            >
              <PenIcon size={16} /> Editar
            </Button>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              className="gap-2"
            >
              <Trash2 size={16} /> Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    clients,
    loading: isLoading,
    error,
    filterClients,
    addClient,
    updateClient,
    deleteClient,
    refreshClients,
  } = useClients();
  const { toast } = useToast();

  // Initialize clients data
  useEffect(() => {
    refreshClients();
  }, [refreshClients]);

  // Handle filtering
  useEffect(() => {
    filterClients(searchTerm, filterStatus);
  }, [searchTerm, filterStatus, filterClients]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle create client form submit
  const handleCreateClient = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addClient(data as any);

      if (result) {
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso.",
        });
        setIsCreateDialogOpen(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o cliente.",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit client form submit
  const handleEditClient = async (data: ClientFormValues) => {
    if (!selectedClient) return false;

    setIsSubmitting(true);
    try {
      const success = await updateClient(selectedClient.id, data);

      if (success) {
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso.",
        });
        setIsEditDialogOpen(false);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível atualizar os dados do cliente.",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete client confirmation
  const handleDeleteClientConfirm = async () => {
    if (!clientToDelete) return;

    setIsSubmitting(true);
    try {
      const success = await deleteClient(clientToDelete.id);

      if (success) {
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
        });
        if (selectedClient?.id === clientToDelete.id) {
          setSelectedClient(null);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o cliente.",
        });
      }
    } finally {
      setIsSubmitting(false);
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  // Handle opening client details
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
  };

  // Handle opening edit dialog
  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsEditDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenCreateModal = () => {
    setIsCreateDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes do sistema"
        actionLabel="Adicionar Cliente"
        actionOnClick={handleOpenCreateModal}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            className="pl-8 bg-background"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PageWrapper>
        <ClientsTable
          clients={clients}
          isLoading={isLoading}
          onView={handleViewClient}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </PageWrapper>

      {/* Client Details Dialog */}
      {selectedClient && (
        <Dialog
          open={!!selectedClient && !isEditDialogOpen}
          onOpenChange={(isOpen) => !isOpen && setSelectedClient(null)}
        >
          <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
            <ClientDetailsView
              client={selectedClient}
              onClose={() => setSelectedClient(null)}
              onEdit={() => setIsEditDialogOpen(true)}
              onDelete={() => {
                setClientToDelete(selectedClient);
                setIsDeleteDialogOpen(true);
              }}
            />
          </div>
        </Dialog>
      )}

      {/* Create Client Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
          <ClientForm
            isOpen={isCreateDialogOpen}
            onClose={() => setIsCreateDialogOpen(false)}
            onSubmit={handleCreateClient}
            isSubmitting={isSubmitting}
            title="Novo Cliente"
          />
        </div>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog
        open={isEditDialogOpen && !!selectedClient}
        onOpenChange={setIsEditDialogOpen}
      >
        {selectedClient && (
          <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Editar Cliente</h2>
            <ClientForm
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleEditClient}
              initialData={{
                business_name: selectedClient.business_name,
                document: selectedClient.document || "",
                contact_name: selectedClient.contact_name,
                email: selectedClient.email,
                phone: selectedClient.phone,
                address: selectedClient.address || "",
                city: selectedClient.city || "",
                state: selectedClient.state || "",
                zip: selectedClient.zip || "",
              }}
              isSubmitting={isSubmitting}
              title="Editar Cliente"
            />
          </div>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClientConfirm}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminClients;
