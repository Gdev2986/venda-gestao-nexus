
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";
import { useToast } from "@/hooks/use-toast";
import { PATHS } from "@/routes/paths";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClientForm } from "@/components/clients/ClientForm";
import { ArrowLeft } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Partner } from "@/types";

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getClient, updateClient, isLoading: clientLoading } = useClients();
  const { partners } = usePartners();
  const [client, setClient] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Transform partners to match required format
  const formattedPartners = partners.map(partner => ({
    id: partner.id,
    business_name: partner.name || partner.business_name || 'Unknown'
  }));

  useEffect(() => {
    const loadClient = async () => {
      if (id) {
        try {
          const clientData = await getClient(id);
          if (clientData) {
            setClient(clientData);
          } else {
            toast({
              variant: "destructive",
              title: "Cliente não encontrado",
              description: "Não foi possível encontrar o cliente solicitado."
            });
            navigate(PATHS.ADMIN.CLIENTS);
          }
        } catch (error) {
          console.error("Error loading client:", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar cliente",
            description: "Ocorreu um erro ao carregar os dados do cliente."
          });
          navigate(PATHS.ADMIN.CLIENTS);
        }
      }
    };
    
    loadClient();
  }, [id, getClient, navigate, toast]);

  const handleGoBack = () => {
    navigate(PATHS.ADMIN.CLIENTS);
  };

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    setSubmitting(true);
    try {
      await updateClient(id, data);
      
      toast({
        title: "Cliente atualizado",
        description: "Os dados do cliente foram atualizados com sucesso."
      });
      
      // Refresh client data
      const updatedClient = await getClient(id);
      if (updatedClient) {
        setClient(updatedClient);
      }
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
        description: "Não foi possível atualizar os dados do cliente."
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (clientLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Cliente não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title={client.name || "Detalhes do Cliente"}
          description="Visualize e edite as informações do cliente"
        />
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <ClientForm
            initialData={client}
            isOpen={true}
            onClose={handleGoBack}
            onSubmit={handleSubmit}
            partners={formattedPartners}
            submitButtonText={submitting ? "Salvando..." : "Atualizar Cliente"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;
