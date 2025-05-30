
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Unlink, AlertCircle, Loader2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LinkedClient {
  id: string;
  business_name: string;
  contact_name: string | null;
  email: string | null;
  status: string | null;
  linked_at: string;
}

interface TaxBlockLinkedClientsProps {
  blockId: string;
}

const TaxBlockLinkedClients = ({ blockId }: TaxBlockLinkedClientsProps) => {
  const [linkedClients, setLinkedClients] = useState<LinkedClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlinkingClientId, setUnlinkingClientId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLinkedClients();
  }, [blockId]);

  const fetchLinkedClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('client_tax_blocks')
        .select(`
          client_id,
          created_at,
          clients:client_id(
            id,
            business_name,
            contact_name,
            email,
            status
          )
        `)
        .eq('block_id', blockId);

      if (error) throw error;

      const clients: LinkedClient[] = (data || []).map(item => ({
        id: item.client_id,
        business_name: item.clients?.business_name || '',
        contact_name: item.clients?.contact_name || null,
        email: item.clients?.email || null,
        status: item.clients?.status || null,
        linked_at: item.created_at
      }));

      setLinkedClients(clients);
    } catch (error) {
      console.error('Error fetching linked clients:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os clientes vinculados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlinkClient = async (clientId: string) => {
    setUnlinkingClientId(clientId);
    try {
      const { error } = await supabase
        .from('client_tax_blocks')
        .delete()
        .eq('block_id', blockId)
        .eq('client_id', clientId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente desvinculado do bloco com sucesso"
      });

      // Remover cliente da lista
      setLinkedClients(prev => prev.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error unlinking client:', error);
      toast({
        title: "Erro",
        description: "Não foi possível desvincular o cliente",
        variant: "destructive"
      });
    } finally {
      setUnlinkingClientId(null);
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Carregando clientes vinculados...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h3 className="text-lg font-medium">Clientes Vinculados</h3>
        <Badge variant="outline">{linkedClients.length}</Badge>
      </div>

      {linkedClients.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Nenhum cliente está vinculado a este bloco de taxas.
          </AlertDescription>
        </Alert>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vinculado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.business_name}
                  </TableCell>
                  <TableCell>
                    {client.contact_name || '-'}
                  </TableCell>
                  <TableCell>
                    {client.email || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(client.status)}
                    >
                      {client.status === "ACTIVE" && "Ativo"}
                      {client.status === "active" && "Ativo"}
                      {client.status === "INACTIVE" && "Inativo"}
                      {client.status === "inactive" && "Inativo"}
                      {!client.status && "Desconhecido"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(client.linked_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={unlinkingClientId === client.id}
                        >
                          {unlinkingClientId === client.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Unlink className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Desvincular cliente</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja desvincular o cliente "{client.business_name}" deste bloco de taxas?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleUnlinkClient(client.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Desvincular
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TaxBlockLinkedClients;
