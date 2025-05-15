
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePartnerClients } from "@/hooks/use-partner-clients";
import { PlusCircle } from "lucide-react";
import ClientsTable from "@/components/clients/ClientsTable";
import { Card, CardContent } from "@/components/ui/card";

const PartnerClients = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { clients, isLoading, error } = usePartnerClients();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewClient = (id: string) => {
    navigate(`/partner/clients/${id}`);
  };

  const handleCreateClient = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateClientSuccess = () => {
    setIsCreateModalOpen(false);
    toast({
      title: "Cliente criado",
      description: "O cliente foi criado com sucesso.",
    });
  };

  return (
    <PageWrapper>
      <div className="flex justify-between items-center mb-6">
        <PageHeader
          title="Clientes"
          description="Gerencie os clientes vinculados à sua parceria"
        />
        <Button onClick={handleCreateClient}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-destructive">
              <p>Erro ao carregar clientes: {error}</p>
            </div>
          ) : (
            <ClientsTable 
              clients={clients} 
              isPartnerView={true} 
            />
          )}
        </CardContent>
      </Card>

      {/* {isCreateModalOpen && (
        <CreateClientModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateClientSuccess}
          isPartnerMode={true}
        />
      )} */}
    </PageWrapper>
  );
};

export default PartnerClients;
