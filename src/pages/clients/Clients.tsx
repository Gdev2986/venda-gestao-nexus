
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types";
import ClientsTable from "@/components/clients/ClientsTable";

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const loadClients = async () => {
      setLoading(true);
      try {
        console.log("Fetching clients from database...");
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('business_name', { ascending: true });

        if (error) {
          throw error;
        }

        console.log("Fetched clients:", data);
        
        if (data && data.length > 0) {
          setClients(data as Client[]);
          setFilteredClients(data as Client[]);
        } else {
          console.log("No clients found, using mock data");
          // Usar dados mockados apenas se não houver dados reais
          const mockClients = [
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
              document: "12.345.678/0001-90",
              status: "active"
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
              document: "98.765.432/0001-10",
              status: "active"
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
              document: "45.678.901/0001-23",
              status: "inactive"
            }
          ];
          setClients(mockClients as Client[]);
          setFilteredClients(mockClients as Client[]);
        }
      } catch (error) {
        console.error("Error loading clients:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load clients. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  useEffect(() => {
    // Filter clients when search term changes
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = clients.filter(client => 
      (client.business_name && client.business_name.toLowerCase().includes(lowerSearchTerm)) ||
      (client.contact_name && client.contact_name.toLowerCase().includes(lowerSearchTerm)) ||
      (client.email && client.email.toLowerCase().includes(lowerSearchTerm)) ||
      (client.document && client.document.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const handleViewClient = (client: Client) => {
    // Navigate to client details page
    navigate(`/clients/${client.id}`);
  };

  const handleEditClient = (client: Client) => {
    // Navigate to client edit page
    navigate(`/clients/${client.id}/edit`);
  };

  const handleDeleteClient = (client: Client) => {
    // Handle client deletion
    console.log("Delete client:", client);
    toast({
      title: "Not implemented",
      description: "Client deletion functionality is not yet implemented",
    });
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Clients</CardTitle>
          <Button onClick={() => navigate("/clients/new")}>Add Client</Button>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                className="pl-8 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <ClientsTable 
            clients={filteredClients}
            isLoading={loading}
            onView={handleViewClient}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
