import React from 'react';
import { PageHeader } from '@/components/page/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { useToast } from '@/hooks/use-toast';
import ClientForm from '@/components/clients/ClientForm';

const ClientNew = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleClientCreated = () => {
    toast({
      title: "Cliente criado",
      description: "O cliente foi criado com sucesso.",
    });
    navigate(PATHS.ADMIN.CLIENTS);
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
          <ClientForm onSuccess={handleClientCreated} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientNew;
