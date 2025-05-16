import { useState } from "react";
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

  // Placeholder for client actions
  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setIsClientDetailsOpen(true);
  };

  // Placeholder client data for the component
  useState(() => {
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
  });

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
            onEdit={() => {}}
            onDelete={() => {}}
          />
        </Card>
      </div>

      {selectedClient && (
        <ClientDetailsModal
          open={isClientDetailsOpen}
          onOpenChange={setIsClientDetailsOpen}
          client={selectedClient}
        />
      )}
    </div>
  );
};

export default PartnerClientsPage;
