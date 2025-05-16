
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Client } from "@/types";
import ClientsTable from "@/components/clients/ClientsTable";
import { PageHeader } from "@/components/page/PageHeader";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";

const PartnerClientsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isClientDetailsOpen, setIsClientDetailsOpen] = useState(false);

  // Mock data for partners and fee plans
  const mockPartners = [
    { id: "p1", company_name: "Partner Company 1" },
    { id: "p2", company_name: "Partner Company 2" }
  ];

  const mockFeePlans = [
    { id: "fp1", name: "Standard Plan" },
    { id: "fp2", name: "Premium Plan" }
  ];

  // Placeholder for client actions
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientDetailsOpen(true);
  };

  const handleEditClient = () => {
    // Implement edit functionality
    console.log("Edit client:", selectedClient?.id);
    setIsClientDetailsOpen(false);
  };

  const handleDeleteClient = () => {
    // Implement delete functionality
    console.log("Delete client:", selectedClient?.id);
    setIsClientDetailsOpen(false);
  };

  // Mock function to get machine count
  const getMachineCount = (clientId: string): number => {
    // In a real app, this would query the database
    return clientId === "1" ? 2 : 1;
  };

  // Placeholder client data for the component
  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const mockClients: Client[] = [
        {
          id: "1",
          business_name: "Acme Co",
          email: "contact@acmeco.com",
          phone: "555-1234",
          status: "active",
          balance: 1500,
          contact_name: "John Doe",
          address: "123 Main St",
          city: "Springfield",
          state: "IL",
          zip: "62701",
          created_at: "2023-01-15T10:00:00Z",
          updated_at: "2023-01-20T14:30:00Z"
        },
        {
          id: "2",
          business_name: "Widget Inc",
          email: "info@widgetinc.com",
          phone: "555-5678",
          status: "active",
          balance: 2200,
          contact_name: "Jane Smith",
          address: "456 Oak Ave",
          city: "Rivertown",
          state: "CA",
          zip: "90210",
          created_at: "2023-02-10T09:15:00Z",
          updated_at: "2023-02-15T11:45:00Z"
        }
      ];
      
      setClients(mockClients);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="container px-4 py-6 max-w-7xl mx-auto">
      <PageHeader 
        title="Clientes" 
        description="Gerencie seus clientes"
      />

      <div className="mt-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Lista de Clientes</h2>
          </div>

          <ClientsTable
            clients={clients}
            isLoading={isLoading}
            onView={handleViewClient}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
          />
        </Card>
      </div>

      {selectedClient && (
        <ClientDetailsModal
          open={isClientDetailsOpen}
          onOpenChange={setIsClientDetailsOpen}
          client={selectedClient}
          partners={mockPartners}
          feePlans={mockFeePlans}
          onEdit={handleEditClient}
          onDelete={handleDeleteClient}
          getMachineCount={getMachineCount}
        />
      )}
    </div>
  );
};

export default PartnerClientsPage;
