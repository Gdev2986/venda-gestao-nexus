
import React from 'react';
import { useParams } from 'react-router-dom';
import { useClients } from '@/hooks/use-clients';
import { PageHeader } from '@/components/page/PageHeader';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import ClientForm, { ClientFormValues } from '@/components/clients/ClientForm';
import { BalanceUpdateDialog } from '@/components/clients/BalanceUpdateDialog';
import { useState } from 'react';

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { clients, isLoading, error } = useClients();
  const [isBalanceDialogOpen, setIsBalanceDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const client = clients?.find(c => c.id === clientId);

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
    return <div>Cliente não encontrado</div>;
  }
  
  const handleFormSubmit = async (data: ClientFormValues) => {
    // Implementation would go here
    console.log("Saving client data:", data);
    return true;
  };

  const handleBalanceUpdateSuccess = () => {
    // Refresh client data
  };

  return (
    <div>
      <PageHeader
        title={client.business_name || client.contact_name || "Detalhes do Cliente"}
        description="Visualize e edite as informações do cliente"
      />
      <div className="space-y-4">
        <ClientForm 
          isOpen={true}
          onClose={() => {}}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
          initialData={client as any}
          submitButtonText="Atualizar"
        />
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
