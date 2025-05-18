
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { transferMachine } from "@/services/machine.service";
import { Client } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("id, business_name")
          .order("business_name", { ascending: true });

        if (error) {
          throw error;
        }

        setClients(data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedClientId) {
      toast({
        variant: "destructive",
        title: "Erro na transferência",
        description: "Selecione um cliente para transferir a máquina"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await transferMachine({
        machine_id: machineId,
        from_client_id: currentClientId || undefined,
        to_client_id: selectedClientId,
        created_by: user?.id || 'system'
      });

      toast({
        title: "Transferência concluída",
        description: `Máquina ${machineName} transferida com sucesso`,
        variant: "default"
      });
      
      onTransferComplete();
    } catch (error) {
      console.error("Error transferring machine:", error);
      toast({
        variant: "destructive",
        title: "Erro na transferência",
        description: "Não foi possível transferir a máquina. Tente novamente."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Carregando clientes...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Máquina</Label>
        <Input 
          value={machineName} 
          readOnly 
          className="bg-muted"
        />
      </div>

      <div>
        <Label>Cliente Atual</Label>
        <Input 
          value={currentClientId ? clients.find(c => c.id === currentClientId)?.business_name || "Desconhecido" : "Sem cliente (estoque)"} 
          readOnly 
          className="bg-muted"
        />
      </div>

      <div>
        <Label htmlFor="new-client">Transferir para</Label>
        <Select
          value={selectedClientId}
          onValueChange={setSelectedClientId}
        >
          <SelectTrigger id="new-client">
            <SelectValue placeholder="Selecione o cliente" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectItem value="stock">Retornar para Estoque</SelectItem>
            {clients.map((client) => (
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

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting || !selectedClientId}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Transferindo...
            </>
          ) : (
            "Transferir"
          )}
        </Button>
      </div>
    </form>
  );
}
