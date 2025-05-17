
import { PageHeader } from '@/components/page/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { PATHS } from '@/routes/paths';
import ClientForm, { ClientFormValues } from '@/components/clients/ClientForm';

const ClientRegister = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegisterSuccess = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement client registration logic here
      console.log("Registering client:", data);
      
      toast({
        title: "Cliente registrado",
        description: "O cliente foi registrado com sucesso.",
      });
      navigate(PATHS.ADMIN.CLIENTS);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar o cliente.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <PageHeader
        title="Novo Cliente"
        description="Registre um novo cliente no sistema"
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm 
            isOpen={true}
            onClose={() => navigate(PATHS.ADMIN.CLIENTS)}
            onSubmit={handleRegisterSuccess}
            isSubmitting={isSubmitting}
            submitButtonText="Registrar Cliente"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRegister;
