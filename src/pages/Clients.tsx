import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusIcon, PenIcon, TrashIcon } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";
import { Badge } from "@/components/ui/badge";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchClients();
    fetchPartners();
  }, []);
  
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          business_name,
          contact_name,
          email,
          phone,
          address,
          city,
          state,
          zip,
          partner_id
        `);
        
      if (error) {
        throw error;
      }
      
      setClients(data || []);
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

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('id, business_name');

      if (error) {
        throw error;
      }

      setPartners(data || []);
    } catch (error) {
      console.error("Erro ao carregar parceiros:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar parceiros",
        description: "Não foi possível carregar a lista de parceiros.",
      });
    }
  };
  
  const handleCreateClick = () => {
    setSelectedClient(null);
    setShowCreateForm(true);
  };
  
  const handleEditClick = (client) => {
    setSelectedClient(client);
    setShowCreateForm(true);
  };
  
  const handleFormClose = () => {
    setShowCreateForm(false);
    setSelectedClient(null);
    fetchClients();
  };

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (selectedClient) {
        // Update existing client
        const { data: updatedClient, error } = await supabase
          .from('clients')
          .update(data)
          .eq('id', selectedClient.id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        setClients(clients.map(client => client.id === selectedClient.id ? updatedClient : client));
        toast({
          title: "Cliente atualizado",
          description: "O cliente foi atualizado com sucesso.",
        });
      } else {
        // Create new client
        const { data: newClient, error } = await supabase
          .from('clients')
          .insert([data])
          .select()
          .single();

        if (error) {
          throw error;
        }

        setClients([...clients, newClient]);
        toast({
          title: "Cliente cadastrado",
          description: "O cliente foi cadastrado com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao salvar o cliente. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
      handleFormClose();
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <Button onClick={handleCreateClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Lista de Clientes</CardTitle>
            <CardDescription>Listagem completa de clientes cadastrados no sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center p-6">
                <p>Carregando...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        Nenhum cliente encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.business_name}</TableCell>
                        <TableCell>{client.contact_name}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditClick(client)}>
                              <PenIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {showCreateForm && (
          <ClientForm 
            isOpen={showCreateForm}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
            initialData={selectedClient || {
              business_name: "",
              contact_name: "",
              email: "",
              phone: "",
              address: "",
              city: "",
              state: "",
              zip: "",
              partner_id: ""
            }}
            title={selectedClient ? "Editar Cliente" : "Novo Cliente"}
            partners={partners}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Clients;
