
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import ClientsTable from "@/components/clients/ClientsTable";
import ClientDetailsModal from "@/components/clients/ClientDetailsModal";
import ClientFormModal from "@/components/clients/ClientFormModal";
import { PageWrapper } from "@/components/page/PageWrapper";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { Spinner } from "@/components/ui/spinner";

// Use the Client type from the hook's return type
type Client = ReturnType<typeof usePartnerClients>["clients"][0];

const PartnerClientsPage = () => {
  const { toast } = useToast();
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Get clients data with the hook
  const { 
    clients, 
    isLoading, 
    error, 
    createClient, 
    updateClient
  } = usePartnerClients();

  const handleCreateClient = async (data: Partial<Client>) => {
    try {
      const success = await createClient.mutateAsync(data);
      if (success) {
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso",
        });
        setShowNewClientModal(false);
        return true;
      }
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o cliente",
      });
      return false;
    }
  };

  const handleUpdateClient = async (data: Partial<Client>) => {
    if (!selectedClient) return false;

    try {
      const success = await updateClient.mutateAsync({
        ...data,
        id: selectedClient.id,
      });
      
      if (success !== undefined) {
        toast({
          title: "Cliente atualizado",
          description: "Os dados do cliente foram atualizados com sucesso",
        });
        setShowDetailsModal(false);
        return true;
      }
      return false;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os dados do cliente",
      });
      return false;
    }
  };

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-xl font-medium text-red-600">Erro</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Clientes"
        description="Gerencie seus clientes"
      >
        <Button onClick={() => setShowNewClientModal(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </PageHeader>

      <div className="mt-8">
        <ClientsTable 
          clients={clients} 
          isLoading={isLoading}
          onClientClick={handleRowClick}
        />
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <ClientDetailsModal
          open={showDetailsModal}
          onOpenChange={setShowDetailsModal}
          client={selectedClient}
          onEdit={() => {
            setShowDetailsModal(false);
            // Give time for the details modal to close before opening edit form
            setTimeout(() => {
              setShowNewClientModal(true);
            }, 300);
          }}
          partners={[]}
          feePlans={[]}
          onDelete={() => {}}
          getMachineCount={() => Promise.resolve(0)}
        />
      )}

      {/* Create/Edit Client Form Modal */}
      <ClientFormModal
        isOpen={showNewClientModal}
        onClose={() => setShowNewClientModal(false)}
        client={selectedClient}
        feePlans={[]}
        partners={[]}
        onSave={selectedClient ? handleUpdateClient : handleCreateClient}
        isSaving={selectedClient ? updateClient.isLoading : createClient.isLoading}
      />
    </PageWrapper>
  );
};

export default PartnerClientsPage;
