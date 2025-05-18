
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { transferMachine } from '@/services/machine.service';
import { useUser } from '@/hooks/use-user';

// Import client services or hooks
import { useClients } from '@/hooks/use-clients';

export interface MachineTransferFormProps {
  machineId: string;
  machineName: string;
  currentClientId?: string | null;
  onTransferComplete: () => void;
}

export function MachineTransferForm({ 
  machineId, 
  machineName, 
  currentClientId, 
  onTransferComplete 
}: MachineTransferFormProps) {
  const { toast } = useToast();
  const { user } = useUser();
  const [targetClientId, setTargetClientId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get list of clients for dropdown
  const { clients, isLoading: clientsLoading } = useClients();
  
  const handleTransfer = async () => {
    if (!targetClientId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para transferir a máquina",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await transferMachine({
        machine_id: machineId,
        from_client_id: currentClientId || undefined,
        to_client_id: targetClientId,
        created_by: user?.id || ''
      });
      
      toast({
        title: "Sucesso",
        description: "Máquina transferida com sucesso"
      });
      
      onTransferComplete();
    } catch (error: any) {
      console.error("Error transferring machine:", error);
      toast({
        title: "Erro na transferência",
        description: error.message || "Não foi possível transferir a máquina",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Maquina: <span className="font-medium text-foreground">{machineName}</span>
      </p>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Cliente atual:</p>
        <Card>
          <CardContent className="py-3">
            {currentClientId ? (
              <span className="text-sm">
                {clients?.find(c => c.id === currentClientId)?.business_name || 'Cliente não encontrado'}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground italic">Estoque</span>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">Transferir para:</p>
        <Select onValueChange={setTargetClientId} value={targetClientId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stock">Estoque</SelectItem>
            {clients?.filter(client => client.id !== currentClientId).map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onTransferComplete} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleTransfer} disabled={!targetClientId || isLoading}>
          {isLoading ? "Transferindo..." : "Transferir"}
        </Button>
      </div>
    </div>
  );
}
