
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  PenIcon, 
  EyeIcon, 
  Search, 
  Trash2, 
  Download,
  Filter,
  UserPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Client {
  id: string;
  business_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  partner_id?: string;
  document?: string;
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [filterPartner, setFilterPartner] = useState<string>("");
  const [partners, setPartners] = useState<{id: string, business_name: string}[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchClients();
    fetchPartners();
  }, [filterPartner]);
  
  const fetchPartners = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      // For now using mocked data
      setPartners([
        { id: "1", business_name: "Parceiro 1" },
        { id: "2", business_name: "Parceiro 2" },
        { id: "3", business_name: "Parceiro 3" },
      ]);
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
    }
  };
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('clients').select(`
        id,
        business_name,
        contact_name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        partner_id,
        document
      `);
      
      // Add partner filter if selected
      if (filterPartner) {
        query = query.eq('partner_id', filterPartner);
      }
        
      const { data, error } = await query;
        
      if (error) {
        throw error;
      }
      
      // For demo, if no data, let's create some mock data
      const clientsData = data || [
        {
          id: "1",
          business_name: "Super Mercado Silva",
          contact_name: "João Silva",
          email: "joao@mercadosilva.com",
          phone: "(11) 98765-4321",
          address: "Rua das Flores, 123",
          city: "São Paulo",
          state: "SP",
          zip: "01310-100",
          partner_id: "1",
          document: "12.345.678/0001-90"
        },
        {
          id: "2",
          business_name: "Padaria Central",
          contact_name: "Maria Oliveira",
          email: "maria@padariacentral.com",
          phone: "(11) 91234-5678",
          address: "Av. Brasil, 500",
          city: "Rio de Janeiro",
          state: "RJ",
          zip: "20940-070",
          partner_id: "2",
          document: "98.765.432/0001-10"
        },
        {
          id: "3",
          business_name: "Lanchonete Boa Vista",
          contact_name: "Pedro Santos",
          email: "pedro@boavista.com",
          phone: "(31) 99876-5432",
          address: "Rua dos Pássaros, 45",
          city: "Belo Horizonte",
          state: "MG",
          zip: "30140-072",
          partner_id: "3",
          document: "45.678.901/0001-23"
        }
      ];
      
      setClients(clientsData as Client[]);
    } catch (error) {
      console.error("Erro ao carregar clientes:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateClick = () => {
    navigate("/clients/new");
  };
  
  const handleEditClick = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };
  
  const handleViewClient = (client: Client) => {
    navigate(`/clients/${client.id}`);
  };
  
  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!selectedClient) return;
    
    try {
      // In a real implementation, this would delete from Supabase
      // await supabase.from('clients').delete().eq('id', selectedClient.id);
      
      setClients(clients.filter(c => c.id !== selectedClient.id));
      
      toast({
        title: "Cliente excluído",
        description: "O cliente foi excluído com sucesso."
      });
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
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

  const exportToCSV = () => {
    // Implementation for exporting client data to CSV
    toast({
      title: "Exportação iniciada",
      description: "Os dados estão sendo exportados para CSV."
    });
  };

  const filteredClients = clients.filter(client => 
    client.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.document && client.document.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button onClick={handleCreateClick}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Listagem completa de clientes cadastrados no sistema.</CardDescription>
            
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar por nome, contato, email ou documento..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex-shrink-0 w-full md:w-64">
                <Select value={filterPartner} onValueChange={setFilterPartner}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrar por parceiro" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os parceiros</SelectItem>
                    {partners.map(partner => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.business_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex space-x-4">
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
              </div>
            ) : (
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
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? "Nenhum cliente encontrado com esses termos." : "Nenhum cliente cadastrado."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell className="font-medium">{client.business_name}</TableCell>
                          <TableCell>{client.contact_name}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                          <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                          <TableCell className="hidden lg:table-cell">{`${client.city}, ${client.state}`}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewClient(client)} title="Visualizar">
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(client)} title="Editar">
                                <PenIcon className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-destructive hover:text-destructive/80"
                                onClick={() => handleDeleteClick(client)}
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
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmação de exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente {selectedClient?.business_name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Clients;
