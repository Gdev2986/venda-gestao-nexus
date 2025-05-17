
import React from 'react';
import { PageHeader } from '@/components/page/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useToast } from '@/hooks/use-toast';
import ClientForm, { ClientFormValues } from '@/components/clients/ClientForm';
import { useState } from 'react';

const ClientNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClientCreated = async (data: ClientFormValues) => {
    setIsSubmitting(true);
    try {
      // Implement client creation logic here
      console.log("Creating client:", data);
      
      toast({
        title: "Cliente criado",
        description: "O cliente foi criado com sucesso.",
      });
      navigate(PATHS.ADMIN.CLIENTS);
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o cliente.",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Novo Cliente"
        description="Crie um novo cliente para gerenciar pagamentos e vendas"
      />
      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm 
            isOpen={true}
            onClose={() => navigate(PATHS.ADMIN.CLIENTS)} 
            onSubmit={handleClientCreated}
            isSubmitting={isSubmitting}
            submitButtonText="Criar Cliente"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNew;
