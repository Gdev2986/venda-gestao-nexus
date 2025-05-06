
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import ClientForm, { ClientFormValues } from "@/components/clients/ClientForm";
import { PATHS } from "@/routes/paths";

const NewClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { toast } = useToast();

  const handleSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      const success = await addClient(data);
      
      if (success) {
        toast({
          title: "Cliente criado",
          description: "O cliente foi criado com sucesso.",
        });
        navigate(PATHS.ADMIN.CLIENTS);
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível criar o cliente.",
        });
        return false;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao criar o cliente.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Novo Cliente</CardTitle>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Voltar
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <ClientForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isOpen={true}
            onClose={() => navigate(-1)}
            submitButtonText="Criar Cliente"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewClient;
