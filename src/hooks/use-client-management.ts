import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClientById,
} from "@/api/clientsApi";
import { fetchPartners } from "@/api/partnersApi";
import { Client, Partner } from "@/types";
import { ClientCreate, ClientUpdate } from "@/types/client";

// Define the main hook for client management
export const useClientManagement = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Format partners for select component
  const formattedPartners = partners.map((partner) => ({
    id: partner.id,
    business_name: partner.business_name || partner.company_name || "N/A",
  }));

  // Fetch clients from the API
  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const clientsData = await fetchClients();
      setClients(clientsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch clients"));
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch partners from the API
  const loadPartners = useCallback(async () => {
    try {
      const partnersData = await fetchPartners();
      setPartners(partnersData);
    } catch (err) {
      console.error("Error fetching partners:", err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros.",
      });
    }
  }, [toast]);

  // Load clients and partners on mount
  useEffect(() => {
    loadClients();
    loadPartners();
  }, [loadClients, loadPartners]);

  // Recalculate total pages when clients or itemsPerPage changes
  useEffect(() => {
    setTotalPages(Math.ceil(clients.length / itemsPerPage));
  }, [clients, itemsPerPage]);

  // Filter clients based on search term
  const filteredClients = clients.filter((client) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (client.business_name && client.business_name.toLowerCase().includes(searchTermLower)) ||
      (client.contact_name && client.contact_name.toLowerCase().includes(searchTermLower)) ||
      (client.email && client.email.toLowerCase().includes(searchTermLower)) ||
      (client.phone && client.phone.toLowerCase().includes(searchTermLower))
    );
  });

  // Paginate clients
  const paginatedClients = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredClients.slice(startIndex, endIndex);
  };

  // Handle search term change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle create client
  const handleCreateClient = async (clientData: ClientCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newClient = await createClient(clientData);
      setClients([...clients, newClient]);
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create client"));
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle view client
  const handleViewClient = (id: string) => {
    console.log("View client", id);
    toast({
      title: "Visualizar cliente",
      description: "Funcionalidade em desenvolvimento.",
    });
  };

  // Handle edit client
  const handleEditClient = async (id: string, clientData: ClientUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updatedClient = await updateClient(id, clientData);
      if (updatedClient) {
        setClients(
          clients.map((client) => (client.id === id ? updatedClient : client))
        );
        toast({
          title: "Cliente atualizado",
          description: "O cliente foi atualizado com sucesso.",
        });
      } else {
        setError(new Error("Failed to update client"));
        toast({
          variant: "destructive",
          title: "Erro ao atualizar cliente",
          description: "Não foi possível atualizar o cliente.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update client"));
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar o cliente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (id: string, name?: string) => {
    setSelectedClient({
      id,
      business_name: name || "Selecionado"
    } as Client);
    setIsDeleteDialogOpen(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;

    setLoading(true);
    setError(null);
    try {
      const success = await deleteClientById(selectedClient.id);
      if (success) {
        setClients(clients.filter((client) => client.id !== selectedClient.id));
        toast({
          title: "Cliente excluído",
          description: "O cliente foi excluído com sucesso.",
        });
      } else {
        setError(new Error("Failed to delete client"));
        toast({
          variant: "destructive",
          title: "Erro ao excluir cliente",
          description: "Não foi possível excluir o cliente.",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete client"));
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente.",
      });
    } finally {
      setLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  return {
    clients: paginatedClients(),
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    showFilters,
    partners,
    formattedPartners,
    selectedClient,
    isDeleteDialogOpen,
    handleSearchChange,
    resetFilters,
    handleCreateClient,
    handleViewClient,
    handleEditClient,
    handleDeleteClick,
    handleDeleteConfirm,
    closeDeleteDialog,
    handlePageChange,
    toggleFilters,
  };
};
