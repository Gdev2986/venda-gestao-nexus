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
import { useClients } from "@/hooks/use-clients";
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
import { useClientRealtime } from "@/hooks/useClientRealtime";

// Import the refactored components
import ClientsTable from "@/components/clients/ClientsTable";
import ClientDetailsView from "@/components/clients/ClientDetailsView";
import ClientFormModal from "@/components/clients/ClientFormModal";

const AdminClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
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

  // Configurar atualizações em tempo real
  useClientRealtime(refreshClients);

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

  // Handle edit client form submit
  const handleEditClient = async (data: any) => {
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
          setIsViewDialogOpen(false);
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
    setIsViewDialogOpen(true);
  };

  // Handle opening edit dialog
  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = () => {
    if (!selectedClient) return;
    setClientToDelete(selectedClient);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerencie os clientes do sistema"
        actionLabel="Adicionar Cliente"
        actionOnClick={() => setIsCreateDialogOpen(true)}
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
          onEdit={(client) => {
            setSelectedClient(client);
            setIsEditDialogOpen(true);
          }}
          onDelete={(client) => {
            setClientToDelete(client);
            setIsDeleteDialogOpen(true);
          }}
          onRefresh={refreshClients}
        />
      </PageWrapper>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsView
          client={selectedClient}
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Create Client Modal */}
      <ClientFormModal
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        title="Novo Cliente"
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <ClientFormModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          title="Editar Cliente"
          initialData={selectedClient}
          onSubmit={handleEditClient}
        />
      )}

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
