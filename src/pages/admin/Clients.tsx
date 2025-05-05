
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { ClientsList, ClientFilters } from "@/components/clients/ClientsList";
import { Client } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateClientModal from "@/components/clients/CreateClientModal";
import ClientDetailsModal from "@/components/clients/ClientDetailsModal";

// Mock fee plans until we have a real API
const mockFeePlans = [
  { id: "1", name: "Básico" },
  { id: "2", name: "Intermediário" },
  { id: "3", name: "Premium" },
];

const ITEMS_PER_PAGE = 50;

const AdminClients = () => {
  const { toast } = useToast();
  const { getClients, updateClient, loading: clientsLoading, error } = useClients();
  const { partners, loading: partnersLoading, refreshPartners } = usePartners();
  
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ClientFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getClients();
      // Add mock data for now
      const enhancedData = data.map(client => ({
        ...client,
        partner_name: partners.find(p => p.id === client.partner_id)?.company_name,
        machines_count: Math.floor(Math.random() * 10), // Mock data
        fee_plan_name: mockFeePlans[Math.floor(Math.random() * mockFeePlans.length)].name,
        balance: client.balance !== undefined ? client.balance : Math.random() * 10000, // Mock data
      }));
      setClients(enhancedData);
      setFilteredClients(enhancedData);
    } catch (err) {
      console.error("Error fetching clients:", err);
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [getClients, partners, toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    refreshPartners();
  }, [refreshPartners]);

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    
    if (!term && Object.keys(filters).length === 0) {
      setFilteredClients(clients);
      return;
    }
    
    let filtered = [...clients];
    
    // Apply search term
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        client =>
          client.business_name?.toLowerCase().includes(lowerTerm) ||
          client.email?.toLowerCase().includes(lowerTerm) ||
          client.phone?.toLowerCase().includes(lowerTerm)
      );
    }
    
    // Apply other filters
    if (filters.partnerId) {
      filtered = filtered.filter(client => client.partner_id === filters.partnerId);
    }
    
    if (filters.feePlanId) {
      filtered = filtered.filter(client => client.fee_plan_id === filters.feePlanId);
    }
    
    if (filters.balanceRange) {
      const [min, max] = filters.balanceRange;
      filtered = filtered.filter(
        client => 
          (client.balance || 0) >= min && 
          (client.balance || 0) <= max
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, filters]);

  const handleFilter = useCallback((newFilters: ClientFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    let filtered = [...clients];
    
    // Apply search term
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        client =>
          client.business_name?.toLowerCase().includes(lowerTerm) ||
          client.email?.toLowerCase().includes(lowerTerm) ||
          client.phone?.toLowerCase().includes(lowerTerm)
      );
    }
    
    // Apply partner filter
    if (newFilters.partnerId) {
      filtered = filtered.filter(client => client.partner_id === newFilters.partnerId);
    }
    
    // Apply fee plan filter
    if (newFilters.feePlanId) {
      filtered = filtered.filter(client => client.fee_plan_id === newFilters.feePlanId);
    }
    
    // Apply balance range filter
    if (newFilters.balanceRange) {
      const [min, max] = newFilters.balanceRange;
      filtered = filtered.filter(
        client => 
          (client.balance || 0) >= min && 
          (client.balance || 0) <= max
      );
    }
    
    setFilteredClients(filtered);
  }, [clients, searchTerm]);

  const handleCreateClient = () => {
    setCreateModalOpen(true);
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setDetailsModalOpen(true);
  };

  const handleLinkPartner = async (clientId: string, partnerId: string) => {
    try {
      await updateClient(clientId, { partner_id: partnerId || null });
      toast({
        title: "Parceiro vinculado",
        description: "O parceiro foi vinculado ao cliente com sucesso.",
      });
      
      // Update local state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { 
                ...client, 
                partner_id: partnerId,
                partner_name: partners.find(p => p.id === partnerId)?.company_name || null 
              } 
            : client
        )
      );
      
      setFilteredClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { 
                ...client, 
                partner_id: partnerId,
                partner_name: partners.find(p => p.id === partnerId)?.company_name || null 
              } 
            : client
        )
      );
    } catch (err) {
      console.error("Error linking partner:", err);
      toast({
        title: "Erro ao vincular parceiro",
        description: "Não foi possível vincular o parceiro ao cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditBalance = async (clientId: string, newBalance: number) => {
    try {
      await updateClient(clientId, { balance: newBalance });
      toast({
        title: "Saldo atualizado",
        description: "O saldo do cliente foi atualizado com sucesso.",
      });
      
      // Update local state
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, balance: newBalance } 
            : client
        )
      );
      
      setFilteredClients(prevClients => 
        prevClients.map(client => 
          client.id === clientId 
            ? { ...client, balance: newBalance } 
            : client
        )
      );
    } catch (err) {
      console.error("Error updating balance:", err);
      toast({
        title: "Erro ao atualizar saldo",
        description: "Não foi possível atualizar o saldo do cliente. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie seus clientes e suas informações"
      >
        <Button onClick={handleCreateClient}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </PageHeader>
      <PageWrapper>
        <ClientsList
          clients={paginatedClients}
          isLoading={isLoading}
          onSearch={handleSearch}
          onFilter={handleFilter}
          onCreateClient={handleCreateClient}
          onViewClient={handleViewClient}
          onLinkPartner={handleLinkPartner}
          onEditBalance={handleEditBalance}
          partners={partners}
          feePlans={mockFeePlans}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </PageWrapper>
      
      {/* Create Client Modal */}
      <CreateClientModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setCreateModalOpen(false)}
        onCreated={fetchClients}
      />
      
      {/* Client Details Modal */}
      <ClientDetailsModal
        clientId={selectedClientId}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedClientId(undefined);
        }}
        onClientUpdated={fetchClients}
      />
    </div>
  );
};

export default AdminClients;
