
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useClients } from "@/hooks/use-clients";
import ClientForm, { ClientFormValues } from "@/components/clients/ClientForm";
import { PATHS } from "@/routes/paths";

const NewClient = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const { addClient } = useClients();
  const { toast } = useToast();

  const handleSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    
    try {
      const result = await addClient(data);
      
      if (result) {
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
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Voltar
            </Button>
            <Button onClick={() => setShowForm(true)}>
              Adicionar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-10 text-muted-foreground">
            Clique no botão "Adicionar Cliente" para cadastrar um novo cliente.
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <div className="max-w-2xl mx-auto bg-background p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Novo Cliente</h2>
          <ClientForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            submitButtonText="Criar Cliente"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default NewClient;
