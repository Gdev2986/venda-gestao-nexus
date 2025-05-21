
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from "@/components/ui/date-picker";
import { supabase } from "@/integrations/supabase/client";
import { transferMachine } from "@/services/machine.service";
import { MachineTransferParams } from "@/types/machine.types";

interface MachineTransferFormProps {
  machineId: string;
  machineName: string;
  currentClientId?: string;
  onTransferComplete: () => void;
}

export const MachineTransferForm: React.FC<MachineTransferFormProps> = ({
  machineId,
  machineName,
  currentClientId,
  onTransferComplete
}) => {
  const [clients, setClients] = useState<{ id: string; business_name: string; }[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [cutoffDate, setCutoffDate] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const { toast } = useToast();

  // Load available clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('id, business_name')
          .order('business_name', { ascending: true });
        
        if (error) throw error;
        
        setClients(data || []);
      } catch (error) {
        console.error("Error loading clients:", error);
        toast({
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingClients(false);
      }
    };
    
    fetchClients();
  }, []);

  const handleTransfer = async () => {
    if (!selectedClientId) {
      toast({
        title: "Erro",
        description: "Selecione um cliente para transferir a máquina.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const transferData: MachineTransferParams = {
        machine_id: machineId,
        from_client_id: currentClientId,
        to_client_id: selectedClientId,
        cutoff_date: cutoffDate?.toISOString()
      };
      
      await transferMachine(transferData);
      
      toast({
        title: "Máquina transferida",
        description: `Máquina transferida com sucesso.`,
      });
      
      onTransferComplete();
    } catch (error) {
      console.error("Error transferring machine:", error);
      toast({
        title: "Erro na transferência",
        description: "Não foi possível transferir a máquina.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Máquina</Label>
        <div className="text-sm font-medium mt-1">{machineName}</div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientSelect">Cliente Atual</Label>
        <div className="text-sm text-muted-foreground">
          {currentClientId 
            ? clients.find(c => c.id === currentClientId)?.business_name || "Carregando..."
            : "Sem cliente (em estoque)"}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="clientSelect">Novo Cliente</Label>
        <Select 
          value={selectedClientId} 
          onValueChange={setSelectedClientId}
          disabled={isLoadingClients}
        >
          <SelectTrigger id="clientSelect" className="w-full">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Remover vinculação (estoque)</SelectItem>
            {clients.map(client => (
              <SelectItem 
                key={client.id} 
                value={client.id}
                disabled={client.id === currentClientId}
              >
                {client.business_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Data de Corte</Label>
        <DatePicker
          selected={cutoffDate}
          onSelect={setCutoffDate}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Data a partir da qual as vendas serão atribuídas ao novo cliente.
        </p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button 
          variant="outline"
          onClick={onTransferComplete}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleTransfer} 
          disabled={isLoading}
        >
          {isLoading ? "Processando..." : "Transferir"}
        </Button>
      </div>
    </div>
  );
};
