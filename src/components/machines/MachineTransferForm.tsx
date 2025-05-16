
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClients } from '@/hooks/use-clients';
import { Machine } from '@/types';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export interface MachineTransferFormProps {
  machines: Machine[];
  currentClientId?: string;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting?: boolean;
}

const MachineTransferForm = ({
  machines,
  currentClientId,
  onSubmit,
  isSubmitting = false
}: MachineTransferFormProps) => {
  const { clients, isLoading, error } = useClients();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);

  const filteredClients = clients.filter(client => client.id !== currentClientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedClient) {
      setFormError("Por favor, selecione um cliente para transferência.");
      return;
    }

    try {
      await onSubmit({
        clientId: selectedClient,
        machineIds: machines.map(m => m.id)
      });
    } catch (error: any) {
      setFormError(error.message || "Ocorreu um erro ao processar a transferência.");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-4"><Spinner size="lg" /></div>;
  }

  if (filteredClients.length === 0) {
    return <div className="text-center p-4 text-muted-foreground">Não há outros clientes disponíveis para transferência.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="client-select">Cliente de destino</Label>
        <Select
          value={selectedClient}
          onValueChange={setSelectedClient}
        >
          <SelectTrigger id="client-select">
            <SelectValue placeholder="Selecionar cliente" />
          </SelectTrigger>
          <SelectContent>
            {filteredClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.business_name || client.company_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formError && (
        <div className="text-sm text-destructive">{formError}</div>
      )}

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={!selectedClient || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Transferindo...
            </>
          ) : (
            'Confirmar Transferência'
          )}
        </Button>
      </div>
    </form>
  );
};

export default MachineTransferForm;
