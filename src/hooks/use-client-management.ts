
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { Client } from "@/types";

export const useClientManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { clients, loading, error, getClients, deleteClient } = useClients();
  const { partners } = usePartners();

  // Transform partners to match required format
  const formattedPartners = partners.map(partner => ({
    id: partner.id,
    business_name: partner.business_name || partner.company_name || 'Unknown'
  }));

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const resetFilters = () => {
    setSearchTerm("");
    // Reset any other filters here
    setCurrentPage(1);
  };

  // Handle client actions
  const handleCreateClient = () => {
    navigate(PATHS.ADMIN.CLIENT_NEW);
  };

  const handleViewClient = (id: string) => {
    navigate(PATHS.ADMIN.CLIENT_DETAILS(id));
  };

  const handleEditClient = (id: string) => {
    navigate(PATHS.ADMIN.CLIENT_DETAILS(id));
  };

  const handleDeleteClick = (id: string, name?: string) => {
    const clientToDelete = clients.find(c => c.id === id) || { id, name };
    setSelectedClient(clientToDelete as Client);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    try {
      await deleteClient(selectedClient.id);
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
    } catch (error) {
      console.error("Error deleting client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir cliente",
        description: "Não foi possível excluir o cliente."
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedClient(null);
    }
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };

  // Filter clients based on search term
  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination controls
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return {
    clients: paginatedClients,
    allClients: filteredClients,
    loading,
    error,
    searchTerm,
    currentPage,
    totalPages,
    showFilters,
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
