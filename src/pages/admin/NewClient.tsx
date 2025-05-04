
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/page/PageHeader";
import { PageWrapper } from "@/components/page/PageWrapper";
import { PATHS } from "@/routes/paths";
import { CreateEditClientForm, ClientFormValues } from "@/components/clients/CreateEditClientForm";
import { useClientsAdmin } from "@/hooks/use-clients-admin";
import { useToast } from "@/hooks/use-toast";

const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addClient, partners, feePlans, loading } = useClientsAdmin();
  
  const handleSubmit = async (data: ClientFormValues) => {
    const result = await addClient(data);
    
    if (result && result.success) {
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso."
      });
      navigate(PATHS.ADMIN.CLIENTS);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Novo Cliente" 
        description="Adicione um novo cliente ao sistema"
        backLink={PATHS.ADMIN.CLIENTS}
        backLinkLabel="Voltar para lista"
      />

      <PageWrapper>
        <CreateEditClientForm 
          partners={partners}
          feePlans={feePlans}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </PageWrapper>
    </div>
  );
};

export default NewClient;
