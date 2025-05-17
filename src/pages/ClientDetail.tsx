import React from 'react';
import { useParams } from 'react-router-dom';
import { useClient } from '@/hooks/use-clients';
import { PageHeader } from '@/components/page/PageHeader';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import ClientForm from '@/components/clients/ClientForm';
import { BalanceUpdateDialog } from '@/components/clients/BalanceUpdateDialog';
import { useState } from 'react';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { client, isLoading, error, mutate } = useClient(clientId!);
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  const handleBalanceUpdateSuccess = () => {
    mutate();
  };

  return (
    <div>
      <PageHeader
        title={client.business_name || client.contact_name || "Detalhes do Cliente"}
        description="Visualize e edite as informações do cliente"
      />
      <div className="space-y-4">
        <ClientForm client={client} />
        <Button onClick={() => setIsBalanceDialogOpen(true)}>Atualizar Saldo</Button>
      </div>

      <BalanceUpdateDialog
        open={isBalanceDialogOpen}
        onOpenChange={setIsBalanceDialogOpen}
        client={client}
        onSuccess={handleBalanceUpdateSuccess}
      />
    </div>
  );
};

export default ClientDetail;
