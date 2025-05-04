
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/components/page/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { ClientForm } from "@/components/clients/ClientForm";
import { useClients } from "@/hooks/use-clients";
import { usePartners } from "@/hooks/use-partners";

const ClientNew = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addClient } = useClients();
  const { partners, getPartners } = usePartners();

  // Fetch partners when component mounts
  useState(() => {
    getPartners();
  });

  const handleGoBack = () => {
    navigate(PATHS.ADMIN.CLIENTS);
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await addClient(data);

      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso."
      });

      // Navigate to client list
      navigate(PATHS.ADMIN.CLIENTS);
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        variant: "destructive",
        title: "Erro ao criar cliente",
        description: "Não foi possível criar o cliente."
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleGoBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader 
          title="Novo Cliente"
          description="Adicione um novo cliente ao sistema"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <ClientForm
            isOpen={true}
            onClose={handleGoBack}
            onSubmit={handleSubmit}
            partners={partners}
            submitButtonText={submitting ? "Salvando..." : "Criar Cliente"}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNew;
