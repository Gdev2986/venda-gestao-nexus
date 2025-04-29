
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useClients } from "@/hooks/use-clients";
import { ClientForm } from "@/components/clients/ClientForm";
import { useToast } from "@/hooks/use-toast";

const ClientNewPage = () => {
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate("/clients");
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const newClient = await addClient(data);
      toast({
        title: "Cliente cadastrado",
        description: "Cliente cadastrado com sucesso!"
      });
      
      // Navigate to the client detail page
      navigate(`/clients/${newClient.id}`);
    } catch (error: any) {
      console.error("Error creating client:", error);
      toast({
        title: "Erro ao cadastrar cliente",
        description: error.message || "Ocorreu um erro ao cadastrar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={handleBack} size="sm" variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Novo Cliente</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cadastrar novo cliente</CardTitle>
            <CardDescription>
              Preencha os dados do novo cliente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              id="new-client-form"
              onSubmit={handleSubmit}
              isOpen={true}
              onClose={handleBack}
              submitButtonText="Cadastrar cliente"
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientNewPage;
