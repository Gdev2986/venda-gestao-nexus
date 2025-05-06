
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchClients } from "@/api/clientsApi";
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
        const data = await fetchClients();
        console.log("Fetched clients:", data);
        setClients(data);
        setFilteredClients(data);
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
