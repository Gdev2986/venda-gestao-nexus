import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Search, Plus, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { ClientStatus } from "@/components/clients/ClientStatus";
import { CreateClientModal } from "@/components/clients/CreateClientModal";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";
import { useDebounce } from "@/hooks/use-debounce";

// Mock data
import { Client } from "@/types";

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [feePlanFilter, setFeePlanFilter] = useState("");
  const [partners, setPartners] = useState<{id: string, company_name: string}[]>([]);
  const [feePlans, setFeePlans] = useState<{id: string, name: string}[]>([]);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    fetchClients();
    fetchPartners();
    fetchFeePlans();
  }, []);
  
  useEffect(() => {
    filterClients();
  }, [debouncedSearchTerm, statusFilter, partnerFilter, feePlanFilter, clients]);
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch from Supabase
      // Mock data for demonstration
      const mockClients = [
        {
          id: "1",
          business_name: "Mercado Silva",
          email: "contato@mercadosilva.com",
          phone: "(11) 98765-4321",
          status: "active",
          balance: 1500.00,
          partner_id: "1",
          created_at: "2023-01-15T10:30:00Z",
          updated_at: "2023-05-20T14:45:00Z",
          contact_name: "João Silva",
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          zip: "01234-567",
          document: "12.345.678/0001-90",
          fee_plan_id: "1"
        },
        {
          id: "2",
          business_name: "Padaria Central",
          email: "contato@padariacentral.com",
          phone: "(11) 91234-5678",
          status: "active",
          balance: 2300.50,
          partner_id: "2",
          created_at: "2023-02-10T09:15:00Z",
          updated_at: "2023-06-05T11:20:00Z",
          contact_name: "Maria Oliveira",
          address: "Av. Central, 456",
          city: "São Paulo",
          state: "SP",
          zip: "04567-890",
          document: "23.456.789/0001-23",
          fee_plan_id: "2"
        },
        {
          id: "3",
          business_name: "Restaurante Bom Sabor",
          email: "contato@bomsabor.com",
          phone: "(11) 97654-3210",
          status: "inactive",
          balance: -500.75,
          partner_id: "3",
          created_at: "2023-03-20T14:00:00Z",
          updated_at: "2023-06-15T16:30:00Z",
          contact_name: "Pedro Santos",
          address: "Rua Gourmet, 789",
          city: "São Paulo",
          state: "SP",
          zip: "05678-901",
          document: "34.567.890/0001-45",
          fee_plan_id: "1"
        }
      ];
      
      setTimeout(() => {
        setClients(mockClients as Client[]);
        setFilteredClients(mockClients as Client[]);
        setIsLoading(false);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar os clientes. Tente novamente.",
      });
      setIsLoading(false);
    }
  };
  
  const fetchPartners = async () => {
    try {
      // In a real implementation, fetch from Supabase
      const mockPartners = [
        { id: "1", company_name: "Parceiro A" },
        { id: "2", company_name: "Parceiro B" },
        { id: "3", company_name: "Parceiro C" }
      ];
      setPartners(mockPartners);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };
  
  const fetchFeePlans = async () => {
    try {
      // In a real implementation, fetch from Supabase
      const mockFeePlans = [
        { id: "1", name: "Plano Básico" },
        { id: "2", name: "Plano Avançado" }
      ];
      setFeePlans(mockFeePlans);
    } catch (error) {
      console.error("Error fetching fee plans:", error);
    }
  };
  
  const filterClients = () => {
    let result = [...clients];
    
    // Apply search term filter
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        client => 
          client.business_name?.toLowerCase().includes(term) || 
          client.email?.toLowerCase().includes(term) ||
          client.contact_name?.toLowerCase().includes(term) ||
          client.phone?.toLowerCase().includes(term) ||
          client.document?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(client => client.status === statusFilter);
    }
    
    // Apply partner filter
    if (partnerFilter) {
      result = result.filter(client => client.partner_id === partnerFilter);
    }
    
    // Apply fee plan filter
    if (feePlanFilter) {
      result = result.filter(client => client.fee_plan_id === feePlanFilter);
    }
    
    setFilteredClients(result);
  };
  
  const handleCreateClient = (clientData: Partial<Client>) => {
    // In a real implementation, save to Supabase
    const newClient = {
      id: Math.random().toString(36).substring(7),
      ...clientData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      balance: clientData.balance || 0,
      status: clientData.status || "active"
    } as Client;
    
    setClients([newClient, ...clients]);
    toast({
      title: "Cliente criado",
      description: "Cliente criado com sucesso!"
    });
    setIsCreateModalOpen(false);
  };
  
  const handleUpdateClient = (clientData: Partial<Client>) => {
    // In a real implementation, update in Supabase
    const updatedClients = clients.map(client => 
      client.id === clientData.id 
        ? { ...client, ...clientData, updated_at: new Date().toISOString() } 
        : client
    );
    
    setClients(updatedClients);
    toast({
      title: "Cliente atualizado",
      description: "Cliente atualizado com sucesso!"
    });
    setIsEditModalOpen(false);
    setSelectedClient(null);
  };
  
  const handleDeleteClient = (clientId: string) => {
    // In a real implementation, delete from Supabase
    setClients(clients.filter(client => client.id !== clientId));
    toast({
      title: "Cliente excluído",
      description: "Cliente excluído com sucesso!"
    });
    setIsDeleteDialogOpen(false);
    setSelectedClient(null);
  };
  
  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsModalOpen(true);
  };
  
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };
  
  const confirmDelete = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  const getPartnerName = (partnerId: string | undefined) => {
    if (!partnerId) return "Nenhum";
    const partner = partners.find(p => p.id === partnerId);
    return partner ? partner.company_name : "Desconhecido";
  };
  
  const getFeePlanName = (planId: string | undefined) => {
    if (!planId) return "Nenhum";
    const plan = feePlans.find(p => p.id === planId);
    return plan ? plan.name : "Desconhecido";
  };
  
  // Count machines linked to client (in real implementation, fetch from DB)
  const getMachineCount = (clientId: string) => {
    // Mock data
    const machineCountMap: Record<string, number> = {
      "1": 3,
      "2": 1,
      "3": 0
    };
    return machineCountMap[clientId] || 0;
  };

  return (
    <>
      <PageHeader 
        title="Clientes" 
        description="Gerencie todos os clientes cadastrados no sistema"
        actionLabel="Adicionar Cliente"
        actionLink="#"
        // Using onClick instead of link to open modal
        onActionClick={() => setIsCreateModalOpen(true)}
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email, contato ou documento..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:w-2/5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={partnerFilter} onValueChange={setPartnerFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Parceiro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os parceiros</SelectItem>
              {partners.map(partner => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={feePlanFilter} onValueChange={setFeePlanFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Plano de taxa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os planos</SelectItem>
              {feePlans.map(plan => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <PageWrapper>
        <Card className="overflow-hidden">
          {isLoading ? (
            <div className="py-12 flex justify-center items-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="hidden lg:table-cell">Parceiro</TableHead>
                  <TableHead className="hidden lg:table-cell">Máquinas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {debouncedSearchTerm || statusFilter || partnerFilter || feePlanFilter
                        ? "Nenhum cliente encontrado com os filtros selecionados."
                        : "Nenhum cliente cadastrado no sistema."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.business_name}</TableCell>
                      <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{client.phone}</TableCell>
                      <TableCell className={`text-right font-mono ${client.balance && client.balance < 0 ? 'text-destructive' : ''}`}>
                        {client.balance?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{getPartnerName(client.partner_id)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getMachineCount(client.id)}</TableCell>
                      <TableCell><ClientStatus status={client.status || "active"} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => handleViewDetails(client)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => confirmDelete(client)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Card>
      </PageWrapper>
      
      {/* Create Client Modal */}
      <CreateClientModal 
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={handleCreateClient}
        partners={partners}
        feePlans={feePlans}
      />
      
      {/* View Client Details Modal */}
      <ClientDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        client={selectedClient}
        partners={partners}
        feePlans={feePlans}
        onEdit={() => {
          setIsDetailsModalOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsModalOpen(false);
          setIsDeleteDialogOpen(true);
        }}
        getMachineCount={getMachineCount}
      />
      
      {/* Edit Client Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <CreateClientModal 
              isInline
              initialData={selectedClient}
              onSubmit={handleUpdateClient}
              partners={partners}
              feePlans={feePlans}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-muted-foreground">
              Tem certeza que deseja excluir o cliente{" "}
              <span className="font-semibold text-foreground">
                {selectedClient?.business_name}
              </span>?
              Esta ação não poderá ser desfeita.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedClient && handleDeleteClient(selectedClient.id)}
            >
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminClients;
