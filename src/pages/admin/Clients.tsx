
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Client, ClientStatus, UserRole } from "@/types";
import { useClients } from "@/hooks/use-clients";
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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import TablePagination from "@/components/ui/table-pagination";
import ClientFilters from "@/components/clients/ClientFilters";
import { 
  Eye, 
  PenIcon, 
  Search, 
  UserPlus,
  Link as LinkIcon,
  Ban,
  PhoneCall,
  Mail,
  Building,
  Wallet
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePartners } from "@/hooks/use-partners";
import { cn } from "@/lib/utils";

interface ClientsFilterParams {
  search?: string;
  partner_id?: string;
  fee_group_id?: string;
  balance_min?: number;
  balance_max?: number;
  status?: ClientStatus;
}

const AdminClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ClientsFilterParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const [linkPartnerDialogOpen, setLinkPartnerDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("");

  const { getClients, updateClient } = useClients();
  const { partners, getPartners } = usePartners();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Items per page
  const itemsPerPage = 50;

  // Fetch clients on component mount and when filters change
  useEffect(() => {
    fetchClients();
    fetchPartners();
  }, [currentPage, filters]);

  // Add debounce for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters(prev => ({...prev, search: searchTerm}));
      setCurrentPage(1); // Reset to first page on new search
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchPartners = async () => {
    try {
      await getPartners();
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      // In a real app, this would pass filters to the API
      const allClients = await getClients();
      
      // Filter clients based on search term and other filters
      let filteredClients = allClients;
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        filteredClients = filteredClients.filter(client => 
          client.business_name?.toLowerCase().includes(search) ||
          client.email?.toLowerCase().includes(search) ||
          client.phone?.toLowerCase().includes(search) ||
          client.document?.toLowerCase().includes(search)
        );
      }
      
      if (filters.partner_id) {
        filteredClients = filteredClients.filter(client => 
          client.partner_id === filters.partner_id
        );
      }
      
      if (filters.fee_group_id) {
        filteredClients = filteredClients.filter(client => 
          client.fee_group_id === filters.fee_group_id
        );
      }
      
      if (filters.status) {
        filteredClients = filteredClients.filter(client => 
          client.status === filters.status
        );
      }
      
      if (filters.balance_min !== undefined) {
        filteredClients = filteredClients.filter(client => 
          (client.balance ?? 0) >= (filters.balance_min ?? 0)
        );
      }
      
      if (filters.balance_max !== undefined) {
        filteredClients = filteredClients.filter(client => 
          (client.balance ?? 0) <= (filters.balance_max ?? 0)
        );
      }
      
      // Calculate total pages
      setTotalPages(Math.ceil(filteredClients.length / itemsPerPage));
      
      // Paginate clients
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedClients = filteredClients.slice(startIndex, startIndex + itemsPerPage);
      
      setClients(paginatedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = () => {
    navigate(PATHS.ADMIN.CLIENT_NEW);
  };

  const handleViewClient = (clientId: string) => {
    navigate(PATHS.ADMIN.CLIENT_DETAILS(clientId));
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters: ClientsFilterParams) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const openLinkPartnerDialog = (clientId: string) => {
    setSelectedClientId(clientId);
    setLinkPartnerDialogOpen(true);
    
    // Find client's current partner
    const client = clients.find(c => c.id === clientId);
    if (client && client.partner_id) {
      setSelectedPartnerId(client.partner_id);
    } else {
      setSelectedPartnerId("");
    }
  };

  const handleLinkPartner = async () => {
    if (!selectedClientId) return;
    
    try {
      // Update client with new partner
      await updateClient(selectedClientId, { partner_id: selectedPartnerId || null });
      
      // Refresh clients list
      await fetchClients();
      
      toast({
        title: "Parceiro vinculado",
        description: "O parceiro foi vinculado ao cliente com sucesso."
      });
      
      setLinkPartnerDialogOpen(false);
    } catch (error) {
      console.error("Error linking partner:", error);
      toast({
        variant: "destructive",
        title: "Erro ao vincular parceiro",
        description: "Não foi possível vincular o parceiro ao cliente."
      });
    }
  };

  const getStatusBadge = (status?: ClientStatus) => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return <Badge className="bg-green-500">Ativo</Badge>;
      case ClientStatus.BLOCKED:
        return <Badge variant="destructive">Bloqueado</Badge>;
      case ClientStatus.PENDING:
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendente</Badge>;
      default:
        return <Badge variant="outline">Não definido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Clientes" 
        description="Gerencie todos os clientes do sistema"
        actionLabel="Adicionar Cliente"
        actionLink={PATHS.ADMIN.CLIENT_NEW}
      />

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle>Lista de Clientes</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="whitespace-nowrap"
            >
              {showFilters ? "Esconder Filtros" : "Mostrar Filtros"}
            </Button>
            <Button onClick={handleCreateClient}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {showFilters && (
            <ClientFilters 
              onFilterChange={handleFilterChange}
              partners={partners}
              className="mb-6"
            />
          )}
          
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">E-mail</TableHead>
                      <TableHead className="hidden md:table-cell">Telefone</TableHead>
                      <TableHead>Parceiro</TableHead>
                      <TableHead className="hidden lg:table-cell">Máquinas</TableHead>
                      <TableHead className="hidden lg:table-cell">Taxas</TableHead>
                      <TableHead>Saldo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                          {filters.search ? "Nenhum cliente encontrado com esses critérios." : "Nenhum cliente cadastrado."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              {client.business_name}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {client.email || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <PhoneCall className="h-4 w-4 text-muted-foreground" />
                              {client.phone || "-"}
                            </div>
                          </TableCell>
                          <TableCell>
                            {client.partner_name ? (
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{client.partner_name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6" 
                                  onClick={() => openLinkPartnerDialog(client.id)}
                                >
                                  <PenIcon className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs" 
                                onClick={() => openLinkPartnerDialog(client.id)}
                              >
                                <LinkIcon className="mr-1 h-3 w-3" />
                                Vincular
                              </Button>
                            )}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <Badge variant="outline" className="bg-slate-100">
                              {client.machines_count || 0}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {client.fee_group_name || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Wallet className="h-4 w-4 text-muted-foreground" />
                              <span className={cn(
                                "font-medium",
                                (client.balance ?? 0) > 0 ? "text-green-600" : 
                                (client.balance ?? 0) < 0 ? "text-red-600" : ""
                              )}>
                                R$ {((client.balance ?? 0) / 100).toFixed(2)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(client.status as ClientStatus)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleViewClient(client.id)}
                                title="Ver detalhes"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title={client.status === ClientStatus.BLOCKED ? "Desbloquear cliente" : "Bloquear cliente"}
                                className={client.status === ClientStatus.BLOCKED ? "text-green-600" : "text-red-600"}
                              >
                                <Ban className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Link Partner Dialog */}
      <Dialog open={linkPartnerDialogOpen} onOpenChange={setLinkPartnerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Parceiro</DialogTitle>
            <DialogDescription>
              Escolha um parceiro para vincular a este cliente.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um parceiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem parceiro</SelectItem>
                {partners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.company_name || partner.business_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkPartnerDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleLinkPartner}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminClients;
