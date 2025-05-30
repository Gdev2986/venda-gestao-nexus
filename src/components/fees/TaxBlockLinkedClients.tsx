
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, Unlink, AlertCircle } from "lucide-react";
import { TaxBlocksService } from "@/services/tax-blocks.service";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LinkedClient {
  clientId: string;
  clientName: string;
  associationId: string;
  associatedAt: string;
}

interface TaxBlockLinkedClientsProps {
  blockId: string;
}

const TaxBlockLinkedClients = ({ blockId }: TaxBlockLinkedClientsProps) => {
  const [linkedClients, setLinkedClients] = useState<LinkedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (blockId) {
      loadLinkedClients();
    }
  }, [blockId]);

  const loadLinkedClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_tax_blocks')
        .select(`
          id,
          client_id,
          created_at,
          clients:client_id(business_name)
        `)
        .eq('block_id', blockId);

      if (error) throw error;

      const clients: LinkedClient[] = (data || [])
        .filter(item => item.clients) // Filter out null clients
        .map(item => ({
          clientId: item.client_id,
          clientName: (item.clients as any)?.business_name || '',
          associationId: item.id,
          associatedAt: item.created_at
        }));

      setLinkedClients(clients);
    } catch (error) {
      console.error('Error loading linked clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes vinculados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkClient = async (associationId: string, clientName: string) => {
    if (!confirm(`Tem certeza que deseja desvincular o cliente "${clientName}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('client_tax_blocks')
        .delete()
        .eq('id', associationId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Cliente "${clientName}" foi desvinculado do bloco`,
      });

      await loadLinkedClients();
    } catch (error) {
      console.error('Error unlinking client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desvincular o cliente",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Carregando clientes vinculados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-medium">Clientes Vinculados</h3>
          <Badge variant="outline">{linkedClients.length}</Badge>
        </div>
      </div>

      {linkedClients.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum cliente vinculado a este bloco de taxas.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {linkedClients.map((client) => (
            <div
              key={client.associationId}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{client.clientName}</p>
                <p className="text-sm text-muted-foreground">
                  Vinculado em {new Date(client.associatedAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnlinkClient(client.associationId, client.clientName)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Unlink className="h-4 w-4 mr-2" />
                Desvincular
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaxBlockLinkedClients;
