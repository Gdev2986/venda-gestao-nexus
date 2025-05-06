
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
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
import { Client } from "@/types";

// Import the refactored components
import ClientsTable from "@/components/clients/ClientsTable";
import ClientDetailsView from "@/components/clients/ClientDetailsView";

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
          <ClientDetailsView
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
            onEdit={() => setIsEditDialogOpen(true)}
            onDelete={() => {
              setClientToDelete(selectedClient);
              setIsDeleteDialogOpen(true);
            }}
          />
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
