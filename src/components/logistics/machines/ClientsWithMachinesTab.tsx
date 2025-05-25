
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getClientsWithMachines } from '@/services/machine.service';
import { Spinner } from '@/components/ui/spinner';

interface ClientWithMachines {
  id: string;
  business_name: string;
  email: string;
  machines: Array<{
    id: string;
    serial_number: string;
    model: string;
    status: string;
  }>;
}

const ClientsWithMachinesTab = () => {
  const [clients, setClients] = useState<ClientWithMachines[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientsWithMachines = async () => {
      try {
        setIsLoading(true);
        const data = await getClientsWithMachines();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients with machines');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientsWithMachines();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Clientes com Máquinas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="text-base">{client.business_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{client.email}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-2">
                Máquinas: {client.machines.length}
              </p>
              {client.machines.length > 0 && (
                <div className="space-y-1">
                  {client.machines.slice(0, 3).map((machine) => (
                    <div key={machine.id} className="text-xs bg-muted p-2 rounded">
                      <span className="font-mono">{machine.serial_number}</span>
                      <span className="ml-2 text-muted-foreground">
                        {machine.model} - {machine.status}
                      </span>
                    </div>
                  ))}
                  {client.machines.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{client.machines.length - 3} mais
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientsWithMachinesTab;
